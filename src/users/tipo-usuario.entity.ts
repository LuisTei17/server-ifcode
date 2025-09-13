import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipo_usuarios')
export class TipoUsuario {
  @PrimaryGeneratedColumn({ name: 'id_tip_usuario' })
  id_tip_usuario: number;

  @Column({ name: 'descricao_tip_usuario' })
  descricao_tip_usuario: string;
}
