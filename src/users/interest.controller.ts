import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from './interest.entity';

@ApiTags('interesses')
@Controller('interesses')
export class InterestController {
  constructor(
    @InjectRepository(Interest)
    private readonly interestRepository: Repository<Interest>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os interesses cadastrados' })
    @ApiResponse({
      status: 200,
      description: 'Lista de interesses',
      schema: {
        example: [
          { id_interesse: 1, descricao: 'Esportes' },
          { id_interesse: 2, descricao: 'Música' }
        ]
      }
    })
  async findAll() {
    return this.interestRepository.find();
  }
}
