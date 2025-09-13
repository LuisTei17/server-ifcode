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
