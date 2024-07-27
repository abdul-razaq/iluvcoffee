import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { UpdateCoffeeDto } from './dtos/create-coffee-dto.ts/update-coffee.dto';
import { CreateCoffeeDto } from './dtos/create-coffee-dto.ts/create-coffee-dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  async getCoffees() {
    return await this.coffeesService.getAll();
  }
  @Get(':id')
  async getCoffee(@Param('id', ParseIntPipe) id: number) {
    return await this.coffeesService.getOne(id);
  }

  @Put(':id')
  async updateCoffee(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return await this.coffeesService.update(id, updateCoffeeDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() coffeeDto: CreateCoffeeDto) {
    await this.coffeesService.create(coffeeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.coffeesService.remove(id);
  }
}
