import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Amazon {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // fK to product table
  @Column({default: 1})
  pid: number;

  @Column()
  rating: string;

  @Column()
  ratingCount: string;

  @Column()
  inStock: string;

  @Column({default: true})
  price: string;

  @Column()
  url:string

  @Column({default: 'IN'})
  countryCode: string;

  @Column()
  priceFetchedAt: string;

}