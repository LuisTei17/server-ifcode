import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './usuarios.entity';
import { Interest } from './interest.entity';

@Entity()
export class UsuarioInteresse {
  @PrimaryGeneratedColumn({ name: 'id_usuario_interesse' })
  id_usuario_interesse: number;

  @ManyToOne(() => User, user => user.usuarioInteresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  user: User;

  @ManyToOne(() => Interest, interest => interest.usuarioInteresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_interesse' })
  interest: Interest;
}
