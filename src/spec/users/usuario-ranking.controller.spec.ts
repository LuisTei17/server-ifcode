import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioRankingController } from 'src/users/usuario-ranking.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsuarioInteresse } from 'src/users/usuario-interesse.entity';

describe('UsuarioRankingController', () => {
  let controller: UsuarioRankingController;
  let userRepo: any;
  let usuarioInteresseRepo: any;

  beforeEach(async () => {
    userRepo = {
      findOne: jest.fn().mockResolvedValue({ id_usuario: 1, cod_tip_usuario: 1, lat: -23.5, lng: -46.6, dt_nasc: '1990-01-01' }),
      find: jest.fn().mockResolvedValue([
        { id_usuario: 2, cod_tip_usuario: 2, lat: -23.6, lng: -46.7, dt_nasc: '1992-05-10' }
      ])
    };
    usuarioInteresseRepo = {
      find: jest.fn().mockResolvedValue([
        { interest: { id_interesse: 1 } },
        { interest: { id_interesse: 2 } }
      ])
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioRankingController],
      providers: [
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(UsuarioInteresse), useValue: usuarioInteresseRepo }
      ],
    }).compile();
    controller = module.get<UsuarioRankingController>(UsuarioRankingController);
  });

  it('should return ranked users', async () => {
    const result = await controller.getRankedUsuarios(1);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });
});
