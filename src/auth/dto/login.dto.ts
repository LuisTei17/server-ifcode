import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ type: String, example: 'joao@email.com', description: 'E-mail do usuário' })
  email_usuario: string;

  @ApiProperty({ type: String, example: 'senhaSegura123', description: 'Senha do usuário' })
  password: string;
}
