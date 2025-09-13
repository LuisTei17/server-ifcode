import { Controller, Post, Body, Req, UseGuards, Get, Put, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { UsersService } from '../users/users.service';
import { UsuarioInteresseService } from '../users/usuario-interesse.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly usuarioInteresseService: UsuarioInteresseService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findByIdWithInterests(req.user.id_usuario);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Body() body) {
    await this.usersService.updateUserProfile(req.user.id_usuario, body);
    if (body.interesses) {
      await this.usuarioInteresseService.replaceUserInterests(req.user.id_usuario, body.interesses);
    }
    return await this.usersService.findByIdWithInterests(req.user.id_usuario);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user (local)' })
  @ApiBody({ type: RegisterDto })
    @ApiResponse({
      status: 201,
      description: 'Usuário cadastrado com sucesso',
      schema: {
        example: {
          id_usuario: 1,
          nome_usuario: 'João Silva',
          email_usuario: 'joao@email.com',
          cod_tip_usuario: 2,
          telefone_usuario: '11999999999',
          dt_nasc: '1990-01-01',
          cpf: '12345678900',
          cod_interesse: 5,
          contato_emerg: 'Maria da Silva',
          cep: '01234567',
          num_endereco: '123',
          complemento_endereco: 'Apto 101',
          lat: -23.5,
          lng: -46.6
        }
      }
    })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user (local)' })
  @ApiBody({ type: LoginDto })
    @ApiResponse({
      status: 200,
      description: 'Usuário autenticado com sucesso',
      schema: {
        example: {
          access_token: 'jwt.token.aqui',
          user: {
            id_usuario: 1,
            nome_usuario: 'João Silva',
            email_usuario: 'joao@email.com',
            cod_tip_usuario: 2,
            lat: -23.5,
            lng: -46.6
          }
        }
      }
    })
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Res() res) {
    const result = await this.authService.login(req.user);
    // Set cookie JWT corretamente para localhost
    res.cookie('jwt', result.access_token, {
      httpOnly: true,
      sameSite: 'lax', // use 'none' apenas se for HTTPS cross-domain
      secure: false,   // true se for HTTPS
      maxAge: 1000 * 60 * 60 * 24 // 1 dia
      // NÃO defina domain para localhost
    });
    delete result.access_token;
    return res.json(result);
  }

  @Get('google')
  @ApiOperation({ summary: 'Google OAuth2 login', description: 'Redireciona para autenticação Google OAuth2' })
  @ApiResponse({ status: 302, description: 'Redireciona para autenticação Google OAuth2' })
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth2 callback', description: 'Callback do Google OAuth2, retorna JWT e dados do usuário' })
    @ApiResponse({
      status: 200,
      description: 'Usuário autenticado via Google, retorna JWT e dados do usuário',
      schema: {
        example: {
          access_token: 'jwt.token.aqui',
          user: {
            id_usuario: 1,
            nome_usuario: 'João Silva',
            email_usuario: 'joao@email.com',
            cod_tip_usuario: 2,
            lat: -23.5,
            lng: -46.6
          }
        }
      }
    })
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req) {
    return this.authService.login(req.user);
  }

}
