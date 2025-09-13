import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './usuarios.entity';
import { Interest } from './interest.entity';
import { UsuarioInteresse } from './usuario-interesse.entity';
import { TipoUsuario } from './tipo-usuario.entity';
import { UsersService } from './usuarios.service';
import { UsuarioInteresseService } from './usuario-interesse.service';
import { InterestController } from './interest.controller';
import { TipoUsuarioController } from './tipo-usuario.controller';
import { UsuarioRankingController } from './usuario-ranking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Interest, UsuarioInteresse, TipoUsuario])],
  providers: [UsersService, UsuarioInteresseService],
  controllers: [InterestController, TipoUsuarioController, UsuarioRankingController],
  exports: [UsersService, UsuarioInteresseService],
})
export class UsersModule {}
