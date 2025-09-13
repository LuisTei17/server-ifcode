import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioInteresse } from './usuario-interesse.entity';
import { User } from './user.entity';
import { Interest } from './interest.entity';

@Injectable()
export class UsuarioInteresseService {
  constructor(
    @InjectRepository(UsuarioInteresse)
    private usuarioInteresseRepository: Repository<UsuarioInteresse>,
    @InjectRepository(Interest)
    private interestRepository: Repository<Interest>,
  ) {}

  async addUserInterests(user: User, interesseIds: number[]): Promise<void> {
    console.log('IDs recebidos para interesses:', interesseIds);
    for (const id of interesseIds) {
      const interesse = await this.interestRepository.findOne({ where: { id_interesse: id } });
      console.log('Buscando interesse ID:', id, 'Encontrado:', interesse);
      if (interesse) {
        const usuarioInteresse = this.usuarioInteresseRepository.create({ user, interest: interesse });
        await this.usuarioInteresseRepository.save(usuarioInteresse);
      }
    }
  }
}
