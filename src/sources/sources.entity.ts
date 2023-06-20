import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sources {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 1 })
  isWorking: boolean;

  @Column()
  created: string;

  @Column()
  updated: string;
}