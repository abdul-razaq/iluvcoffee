import { Controller, Get } from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
  @Get()
  getCoffees() {
    return [
      {
        id: 1,
        name: 'Cappuccino',
        price: 5.5,
      },
      {
        id: 2,
        name: 'Latte',
        price: 6.0,
      },
    ];
  }
}
