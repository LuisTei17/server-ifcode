import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}


  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async findByIdWithInterests(id_usuario: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id_usuario },
      relations: ['usuarioInteresses', 'usuarioInteresses.interest'],
    });
    if (!user) return null;
    // Monta resposta amigável para o front
    return {
      id: user.id_usuario,
      nome: user.nome_usuario,
      email: user.email_usuario,
      telefone: user.telefone_usuario,
      dataNascimento: user.dt_nasc,
      cpf: user.cpf,
      contatoEmergencia: user.contato_emerg,
      cep: user.cep,
      numero: user.num_endereco,
      complemento: user.complemento_endereco,
      interesses: user.usuarioInteresses?.map(ui => ({
        id_interesse: ui.interest.id_interesse,
        descricao: ui.interest.descricao,
      })) || [],
    };
  }

  async updateUserProfile(id_usuario: number, data: any): Promise<void> {
    const updateData: any = {
      nome_usuario: data.nome,
      email_usuario: data.email,
      telefone_usuario: data.telefone,
      dt_nasc: data.dataNascimento,
      cpf: data.cpf,
      contato_emerg: data.contatoEmergencia,
      cep: data.cep,
      num_endereco: data.numero,
      complemento_endereco: data.complemento,
    };
    await this.usersRepository.update(id_usuario, updateData);
  }

  async findByEmail(email_usuario: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email_usuario } });
  }

  async findOrCreateSocial(data: Partial<User>): Promise<User> {
    let user = await this.usersRepository.findOne({ where: { provider: data.provider, providerId: data.providerId } });
    if (!user) {
      user = this.usersRepository.create(data);
      await this.usersRepository.save(user);
    }
    return user;
  }
}
