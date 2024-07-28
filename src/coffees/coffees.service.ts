import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dtos/create-coffee-dto';
import { UpdateCoffeeDto } from './dtos/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { Event } from 'src/event/entities/event.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeesRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorsRepository: Repository<Flavor>,
    private readonly dataSource: DataSource,
  ) {}

  private async preloadFlavorByName(flavor: string): Promise<Flavor> {
    const existingFlavor = await this.flavorsRepository.findOne({
      where: { name: flavor },
    });
    if (existingFlavor) return existingFlavor;
    return this.flavorsRepository.create({ name: flavor });
  }

  async getAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return await this.coffeesRepository.find({
      relations: ['flavors'],
      take: limit,
      skip: offset,
    });
  }

  async getOne(id: number) {
    const coffee = await this.coffeesRepository.findOne({
      where: { id },
      relations: ['flavors'],
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee with ID: ${id} not found`);
    }
    return coffee;
  }

  async create(coffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      coffeeDto.flavors.map(
        async (flavor) => await this.preloadFlavorByName(flavor),
      ),
    );
    const coffee = this.coffeesRepository.create({ ...coffeeDto, flavors });
    return await this.coffeesRepository.save(coffee);
  }

  async update(id: number, coffeeDto: UpdateCoffeeDto) {
    const flavors =
      coffeeDto.flavors &&
      (await Promise.all(
        coffeeDto.flavors.map(
          async (flavor) => await this.preloadFlavorByName(flavor),
        ),
      ));
    const coffee = await this.coffeesRepository.preload({
      id,
      ...coffeeDto,
      flavors,
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee with ID: ${id} not found`);
    }

    return this.coffeesRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.getOne(id);
    return this.coffeesRepository.remove(coffee);
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendation++;

      const event = new Event();
      event.name = 'coffee-recommendation';
      event.type = 'coffee';
      event.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(event);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
