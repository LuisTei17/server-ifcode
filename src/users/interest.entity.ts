import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsuarioInteresse } from './usuario-interesse.entity';

@Entity()
export class Interest {
  @OneToMany(() => UsuarioInteresse, usuarioInteresse => usuarioInteresse.interest)
  usuarioInteresses: UsuarioInteresse[];
  @PrimaryGeneratedColumn({ name: 'id_interesse' })
  id_interesse: number;

  @Column({ name: 'descricao', unique: true })
  descricao: string;
}
