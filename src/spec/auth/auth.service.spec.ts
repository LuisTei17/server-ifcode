import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/usuarios.service';
import { UsuarioInteresseService } from 'src/users/usuario-interesse.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  const mockUsersService = {
    create: jest.fn().mockImplementation((dto) => ({ ...dto, id_usuario: 10 })),
    findByEmail: jest.fn().mockImplementation((email) => {
      if (email === 'exists@example.com') return { id_usuario: 1, HASH: '$2a$10$hash', email_usuario: email };
      return undefined;
    }),
  };
  const mockUsuarioInteresseService = {
    addUserInterests: jest.fn().mockResolvedValue(true),
  };
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('signed-token')
  };

  beforeEach(async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pass');
    (bcrypt.compare as jest.Mock).mockImplementation((plain, hash) => Promise.resolve(hash === '$2a$10$hash'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: UsuarioInteresseService, useValue: mockUsuarioInteresseService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should register a new user and add interests when provided', async () => {
    const dto = { nome: 'Test', email: 't@example.com', password: 'pass', interesses: [1, 2], tipoUsuario: 2 };
    const result = await service.register(dto);
    expect(result).toHaveProperty('id_usuario');
    expect(mockUsuarioInteresseService.addUserInterests).toHaveBeenCalled();
  });

  it('should validate existing user with correct password', async () => {
    const user = await service.validateUser('exists@example.com', 'any');
    expect(user).toBeDefined();
    expect(user.id_usuario).toBe(1);
  });

  it('should return null for invalid credentials', async () => {
    const user = await service.validateUser('nope@example.com', 'any');
    expect(user).toBeNull();
  });

  it('should return access token on login', async () => {
    const payloadUser = { id_usuario: 5, email_usuario: 'u@example.com' };
    const res = await service.login(payloadUser as any);
    expect(res).toHaveProperty('access_token', 'signed-token');
    expect(res.user).toBeDefined();
  });
});
