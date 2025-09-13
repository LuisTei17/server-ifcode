import { Test, TestingModule } from '@nestjs/testing';
import { VisitsController } from 'src/visits/visits.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Visit } from 'src/visits/visit.entity';
import { CreateVisitDto, UpdateVisitStatusDto } from 'src/visits/dto/visit.dto';

describe('VisitsController', () => {
  let controller: VisitsController;
  let visitRepo: any;

  beforeEach(async () => {
    visitRepo = {
      create: jest.fn().mockImplementation((dto) => ({ ...dto, status: 'reserva' })),
      save: jest.fn().mockImplementation((visit) => ({ ...visit, id: 1 })),
      update: jest.fn().mockResolvedValue(true),
      findOne: jest.fn().mockResolvedValue({ id: 1, status: 'aceita' }),
      find: jest.fn().mockResolvedValue([{ id: 1, status: 'reserva' }])
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisitsController],
      providers: [
        { provide: getRepositoryToken(Visit), useValue: visitRepo }
      ],
    }).compile();
    controller = module.get<VisitsController>(VisitsController);
  });

  it('should create a visit', async () => {
    const dto: CreateVisitDto = { id_idoso: 1, id_voluntario: 2, id_interesse: 5, datahora_inicio: '2025-09-13 14:00:00', datahora_fim: null, status: 'reserva', nota_idoso: null, nota_voluntario: null };
    const result = await controller.create(dto);
    expect(result).toHaveProperty('id');
    expect(result.status).toBe('reserva');
  });

  it('should update visit status', async () => {
    const dto: UpdateVisitStatusDto = { status: 'aceita' };
    const result = await controller.updateStatus(1, dto);
    expect(result).toHaveProperty('id');
    expect(result.status).toBe('aceita');
  });

  it('should get visit details', async () => {
    const result = await controller.findOne(1);
    expect(result).toHaveProperty('id');
  });

  it('should list visits', async () => {
    const result = await controller.findAll(1, 2);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('id');
  });
});
