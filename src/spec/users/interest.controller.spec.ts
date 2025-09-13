import { Test, TestingModule } from '@nestjs/testing';
import { InterestController } from 'src/users/interest.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Interest } from 'src/users/interest.entity';

describe('InterestController', () => {
  let controller: InterestController;
  let repo: any;

  beforeEach(async () => {
    repo = {
      find: jest.fn().mockResolvedValue([
        { id_interesse: 1, descricao: 'Esportes' },
        { id_interesse: 2, descricao: 'Música' }
      ])
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterestController],
      providers: [
        { provide: getRepositoryToken(Interest), useValue: repo }
      ]
    }).compile();

    controller = module.get<InterestController>(InterestController);
  });

  it('should list all interests', async () => {
    const result = await controller.findAll();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(repo.find).toHaveBeenCalled();
  });
});
