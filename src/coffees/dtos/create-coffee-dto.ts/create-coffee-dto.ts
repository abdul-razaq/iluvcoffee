import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  brand: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  name: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  description: string;
  @IsString({ each: true })
  flavors: string[];
}
