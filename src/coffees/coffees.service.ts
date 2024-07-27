import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coffees } from './entities/coffee.entity';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dtos/create-coffee-dto.ts/create-coffee-dto';
import { UpdateCoffeeDto } from './dtos/create-coffee-dto.ts/update-coffee.dto';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffees)
    private readonly coffeesRepository: Repository<Coffees>,
  ) {}
  async getAll() {
    return await this.coffeesRepository.find();
  }

  async getOne(id: number) {
    const coffee = await this.coffeesRepository.findOne({ where: { id } });
    if (!coffee) {
      throw new NotFoundException(`Coffee with ID: ${id} not found`);
    }
    return coffee;
  }

  async create(coffeeDto: CreateCoffeeDto) {
    const coffee = this.coffeesRepository.create(coffeeDto);
    return await this.coffeesRepository.save(coffee);
  }

  async update(id: number, coffeeDto: UpdateCoffeeDto) {
    const coffee = await this.coffeesRepository.preload({
      id,
      ...coffeeDto,
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
}
