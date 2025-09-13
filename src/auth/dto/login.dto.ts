import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  email_usuario: string;

  @ApiProperty()
  password: string;
}
