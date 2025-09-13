import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Visit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  userId: number;

  @Column()
  elderlyName: string;
}
