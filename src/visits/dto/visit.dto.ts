import { ApiProperty } from '@nestjs/swagger';

export class CreateVisitDto {
  @ApiProperty({ type: Number, example: 1, description: 'ID do usuário idoso que solicitou o serviço' })
  id_idoso: number;

  @ApiProperty({ type: Number, example: 2, description: 'ID do voluntário solicitado' })
  id_voluntario: number;

  @ApiProperty({ type: Number, example: 5, description: 'ID do interesse relacionado à visita' })
  id_interesse: number;

  @ApiProperty({ type: String, example: '2025-09-13 14:00:00', description: 'Data/hora de início da visita (YYYY-MM-DD HH:mm:ss)' })
  datahora_inicio: string;
}

export class UpdateVisitStatusDto {
  @ApiProperty({ type: String, example: 'aceita', description: 'Novo status da visita' })
  status: string;
}
