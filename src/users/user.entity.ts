import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsuarioInteresse } from './usuario-interesse.entity';

@Entity()
export class User {
    @OneToMany(() => UsuarioInteresse, usuarioInteresse => usuarioInteresse.user)
    usuarioInteresses: UsuarioInteresse[];
    @PrimaryGeneratedColumn({ name: 'id_usuario' })
    id_usuario: number;

    @Column({ name: 'nome_usuario' })
    nome_usuario: string;

    @Column({ name: 'email_usuario', unique: true })
    email_usuario: string;

    @Column({ name: 'cod_tip_usuario' })
    cod_tip_usuario: number; // FK para tipo_usuarios

    @Column({ name: 'telefone_usuario', nullable: true })
    telefone_usuario: string;

    @Column({ name: 'dt_nasc', type: 'date', nullable: true })
    dt_nasc: Date;

    @Column({ name: 'cpf', nullable: true })
    cpf: string;

    @Column({ name: 'cod_interesse', nullable: true })
    cod_interesse: number; // FK para interesses_usuarios

    @Column({ name: 'contato_emerg', nullable: true })
    contato_emerg: string;

    @Column({ name: 'cep', nullable: true })
    cep: string;

    @Column({ name: 'num_endereco', nullable: true })
    num_endereco: string;

    @Column({ name: 'complemento_endereco', nullable: true })
    complemento_endereco: string;

    @Column({ name: 'HASH', nullable: true })
    HASH: string;

    @Column({ name: 'SALT', nullable: true })
    SALT: string;

    @Column({ nullable: true })
    provider: string;

    @Column({ nullable: true })
    providerId: string;
}
