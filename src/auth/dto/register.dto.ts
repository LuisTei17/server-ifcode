import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  nome_usuario: string;

  @ApiProperty()
  email_usuario: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  cod_tip_usuario: number;

  @ApiProperty({ required: false })
  telefone_usuario?: string;

  @ApiProperty({ required: false })
  dt_nasc?: Date;

  @ApiProperty({ required: false })
  cpf?: string;

  @ApiProperty({ required: false })
  cod_interesse?: number;

  @ApiProperty({ required: false })
  contato_emerg?: string;

  @ApiProperty({ required: false })
  cep?: string;

  @ApiProperty({ required: false })
  num_endereco?: string;

  @ApiProperty({ required: false })
  complemento_endereco?: string;
}
