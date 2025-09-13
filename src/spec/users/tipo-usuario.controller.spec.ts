import { Test, TestingModule } from '@nestjs/testing';
import { TipoUsuarioController } from 'src/users/tipo-usuario.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TipoUsuario } from 'src/users/tipo-usuario.entity';

describe('TipoUsuarioController', () => {
  let controller: TipoUsuarioController;
  let repo: any;

  beforeEach(async () => {
    repo = { find: jest.fn().mockResolvedValue([{ id_tip_usuario: 1, descricao_tip_usuario: 'Idoso' }]) };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoUsuarioController],
      providers: [
        { provide: getRepositoryToken(TipoUsuario), useValue: repo }
      ]
    }).compile();

    controller = module.get<TipoUsuarioController>(TipoUsuarioController);
  });

  it('should list all tipo usuario', async () => {
    const result = await controller.findAll();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('id_tip_usuario');
    expect(repo.find).toHaveBeenCalled();
  });
});
