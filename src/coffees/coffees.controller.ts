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
  Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { UpdateCoffeeDto } from './dtos/update-coffee.dto';
import { CreateCoffeeDto } from './dtos/create-coffee-dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  async getCoffees(@Query() paginationQuery: PaginationQueryDto) {
    return await this.coffeesService.getAll(paginationQuery);
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
    return await this.coffeesService.create(coffeeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.coffeesService.remove(id);
  }
}
