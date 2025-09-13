import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsuarioInteresseService } from '../users/usuario-interesse.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private usuarioInteresseService: UsuarioInteresseService,
    private jwtService: JwtService,
  ) {}

  async register(body) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    try {
      const user = await this.usersService.create({
        nome_usuario: body.nome,
        email_usuario: body.email,
        cod_tip_usuario: body.tipoUsuario,
        telefone_usuario: body.telefone,
        dt_nasc: body.dataNascimento,
        cpf: body.cpf,
        contato_emerg: body.contatoEmergencia,
        cep: body.cep,
        num_endereco: body.numero,
        complemento_endereco: body.complemento,
        HASH: hashedPassword,
        provider: 'local',
      });
      // Preencher interesses do usuário (agora por IDs)
      if (body.interesses) {
        const interesseIds = Array.isArray(body.interesses) ? body.interesses : [body.interesses];
        await this.usuarioInteresseService.addUserInterests(user, interesseIds);
      }
      return user;
    } catch (error) {
      throw new Error('Error registering user: ' + error.message);
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
  if (user && user.HASH && await bcrypt.compare(password, user.HASH)) {
      return user;
    }
    return null;
  }

  async login(user) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
