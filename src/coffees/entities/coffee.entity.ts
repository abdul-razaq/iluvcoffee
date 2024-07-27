import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Coffees {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ type: 'json', nullable: true })
  flavors: string[];
}
