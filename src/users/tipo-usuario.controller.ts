import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoUsuario } from './tipo-usuario.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('tipos-usuario')
@Controller('tipos-usuario')
export class TipoUsuarioController {
  constructor(
    @InjectRepository(TipoUsuario)
    private readonly tipoUsuarioRepository: Repository<TipoUsuario>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os tipos de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de usuário',
    schema: {
      example: [
        { id_tip_usuario: 1, descricao_tip_usuario: 'Idoso' },
        { id_tip_usuario: 2, descricao_tip_usuario: 'Voluntário' }
      ]
    }
  })
  async findAll() {
    return this.tipoUsuarioRepository.find();
  }
}
