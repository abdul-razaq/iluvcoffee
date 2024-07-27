import { Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffees } from './entities/coffee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coffees])],
  providers: [CoffeesService],
  controllers: [CoffeesController],
})
export class CoffeesModule {}
