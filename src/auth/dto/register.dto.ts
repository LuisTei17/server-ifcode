import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ type: String, example: 'João Silva', description: 'Nome completo do usuário' })
  nome_usuario: string;

  @ApiProperty({ type: String, example: 'joao@email.com', description: 'E-mail do usuário' })
  email_usuario: string;

  @ApiProperty({ type: String, example: 'senhaSegura123', description: 'Senha para autenticação local' })
  password: string;

  @ApiProperty({ type: Number, example: 2, description: 'Código do tipo de usuário' })
  cod_tip_usuario: number;

  @ApiProperty({ type: String, required: false, example: '11999999999', description: 'Telefone do usuário' })
  telefone_usuario?: string;

  @ApiProperty({ type: String, required: false, example: '1990-01-01', description: 'Data de nascimento (YYYY-MM-DD)' })
  dt_nasc?: Date;

  @ApiProperty({ type: String, required: false, example: '12345678900', description: 'CPF do usuário' })
  cpf?: string;

  @ApiProperty({ type: Number, required: false, example: 5, description: 'Código do interesse do usuário' })
  cod_interesse?: number;

  @ApiProperty({ type: String, required: false, example: 'Maria da Silva', description: 'Contato de emergência' })
  contato_emerg?: string;

  @ApiProperty({ type: String, required: false, example: '01234567', description: 'CEP do endereço' })
  cep?: string;

  @ApiProperty({ type: String, required: false, example: '123', description: 'Número do endereço' })
  num_endereco?: string;

  @ApiProperty({ type: String, required: false, example: 'Apto 101', description: 'Complemento do endereço' })
  complemento_endereco?: string;
}
