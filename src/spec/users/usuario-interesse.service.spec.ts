import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioInteresseService } from 'src/users/usuario-interesse.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsuarioInteresse } from 'src/users/usuario-interesse.entity';
import { Interest } from 'src/users/interest.entity';
import { User } from 'src/users/usuarios.entity';

describe('UsuarioInteresseService', () => {
  let service: UsuarioInteresseService;
  let usuarioInteresseRepo: any;
  let interestRepo: any;

  beforeEach(async () => {
    usuarioInteresseRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockResolvedValue(true)
    };
    interestRepo = {
      findOne: jest.fn().mockImplementation(({ where }) => ({ id_interesse: where.id_interesse, descricao: 'Teste' }))
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioInteresseService,
        { provide: getRepositoryToken(UsuarioInteresse), useValue: usuarioInteresseRepo },
        { provide: getRepositoryToken(Interest), useValue: interestRepo }
      ],
    }).compile();
    service = module.get<UsuarioInteresseService>(UsuarioInteresseService);
  });

  it('should add user interests', async () => {
    const user = { id_usuario: 1 } as User;
    const interesseIds = [1, 2];
    await service.addUserInterests(user, interesseIds);
    expect(interestRepo.findOne).toHaveBeenCalledTimes(2);
    expect(usuarioInteresseRepo.create).toHaveBeenCalledTimes(2);
    expect(usuarioInteresseRepo.save).toHaveBeenCalledTimes(2);
  });
});
