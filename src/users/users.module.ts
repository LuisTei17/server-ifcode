import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Interest } from './interest.entity';
import { UsuarioInteresse } from './usuario-interesse.entity';
import { UsersService } from './users.service';
import { UsuarioInteresseService } from './usuario-interesse.service';
import { InterestController } from './interest.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Interest, UsuarioInteresse])],
  providers: [UsersService, UsuarioInteresseService],
  controllers: [InterestController],
  exports: [UsersService, UsuarioInteresseService],
})
export class UsersModule {}
