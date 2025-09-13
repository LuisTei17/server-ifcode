import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Visit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_idoso: number;

  @Column()
  id_voluntario: number;

  @Column()
  id_interesse: number;

  @Column({ type: 'datetime' })
  datahora_inicio: Date;

  @Column({ type: 'datetime', nullable: true })
  datahora_fim: Date;

  @Column({ type: 'boolean', default: false })
  teve_emergencia: boolean;

  @Column({ type: 'int', nullable: true })
  avaliacao_idoso: number;

  @Column({ type: 'int', nullable: true })
  avaliacao_voluntario: number;

  @Column({ type: 'varchar', length: 20 })
  status: string;
}
