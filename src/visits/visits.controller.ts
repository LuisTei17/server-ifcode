import { Controller, Post, Body, Patch, Param, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visit } from './visit.entity';
import { CreateVisitDto, UpdateVisitStatusDto } from './dto/visit.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('visitas')
@Controller('visitas')
export class VisitsController {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar uma nova visita (reserva)' })
  @ApiBody({ type: CreateVisitDto })
  @ApiResponse({ status: 201, description: 'Visita registrada', schema: { example: { id: 1, status: 'reserva' } } })
  async create(@Body() dto: CreateVisitDto) {
    const visit = this.visitRepository.create({ ...dto, status: 'reserva' });
    return this.visitRepository.save(visit);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status da visita' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateVisitStatusDto })
  @ApiResponse({ status: 200, description: 'Status atualizado', schema: { example: { id: 1, status: 'aceita' } } })
  async updateStatus(@Param('id') id: number, @Body() dto: UpdateVisitStatusDto) {
    await this.visitRepository.update(id, { status: dto.status });
    return this.visitRepository.findOne({ where: { id } });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhar uma visita' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Dados da visita', schema: { example: { id: 1, id_idoso: 1, id_voluntario: 2, status: 'aceita' } } })
  async findOne(@Param('id') id: number) {
    return this.visitRepository.findOne({ where: { id } });
  }

  @Get()
  @ApiOperation({ summary: 'Listar visitas por usuário ou voluntário' })
  @ApiQuery({ name: 'id_usuario', required: false, type: Number })
  @ApiQuery({ name: 'id_voluntario', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de visitas', schema: { example: [{ id: 1, id_idoso: 1, id_voluntario: 2, status: 'reserva' }] } })
  async findAll(@Query('id_usuario') id_usuario?: number, @Query('id_voluntario') id_voluntario?: number) {
    const where: any = {};
    if (id_usuario) where.id_idoso = id_usuario;
    if (id_voluntario) where.id_voluntario = id_voluntario;
    return this.visitRepository.find({ where });
  }
}
