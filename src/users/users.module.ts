import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Interest } from './interest.entity';
import { UsuarioInteresse } from './usuario-interesse.entity';
import { TipoUsuario } from './tipo-usuario.entity';
import { UsersService } from './users.service';
import { UsuarioInteresseService } from './usuario-interesse.service';
import { InterestController } from './interest.controller';
import { TipoUsuarioController } from './tipo-usuario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Interest, UsuarioInteresse, TipoUsuario])],
  providers: [UsersService, UsuarioInteresseService],
  controllers: [InterestController, TipoUsuarioController],
  exports: [UsersService, UsuarioInteresseService],
})
export class UsersModule {}
