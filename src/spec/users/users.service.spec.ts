import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

const userArray = [
  { id_usuario: 1, nome_usuario: 'João', email_usuario: 'joao@email.com', cep: '01234567', provider: 'google', providerId: '123' },
  { id_usuario: 2, nome_usuario: 'Maria', email_usuario: 'maria@email.com', cep: '01234567', provider: undefined, providerId: undefined }
];

const userRepoMock = {
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockImplementation((user) => ({ ...user, id_usuario: 99 })),
  findOne: jest.fn().mockImplementation(({ where }) => userArray.find(u => u.email_usuario === where.email_usuario || (u.provider === where.provider && u.providerId === where.providerId)))
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: userRepoMock }
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('should create a user', async () => {
    const dto = { nome_usuario: 'Teste', email_usuario: 'teste@email.com', cep: '01234567' };
    const result = await service.create(dto);
    expect(result).toHaveProperty('id_usuario');
    expect(result.nome_usuario).toBe('Teste');
  });

  it('should find user by email', async () => {
    const result = await service.findByEmail('joao@email.com');
    expect(result).toBeDefined();
    expect(result.nome_usuario).toBe('João');
  });

  it('should find or create social user', async () => {
    const result = await service.findOrCreateSocial({ provider: 'google', providerId: '123', nome_usuario: 'Social', email_usuario: 'social@email.com' });
    expect(result).toBeDefined();
  });
});
