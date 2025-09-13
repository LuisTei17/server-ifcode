import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioInteresse } from './usuario-interesse.entity';
import { User } from './usuarios.entity';
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
    for (const id of interesseIds) {
      const interesse = await this.interestRepository.findOne({ where: { id_interesse: id } });
      if (interesse) {
        const usuarioInteresse = this.usuarioInteresseRepository.create({ user, interest: interesse });
        await this.usuarioInteresseRepository.save(usuarioInteresse);
      }
    }
  }

  async replaceUserInterests(id_usuario: number, interesseIds: number[]): Promise<void> {
    // Apenas adiciona novos interesses (não deleta os antigos)
    for (const id of interesseIds) {
      const interesse = await this.interestRepository.findOne({ where: { id_interesse: id } });
      if (interesse) {
        const usuarioInteresse = this.usuarioInteresseRepository.create({ user: { id_usuario } as any, interest: interesse });
        await this.usuarioInteresseRepository.save(usuarioInteresse);
      }
    }
  }
}