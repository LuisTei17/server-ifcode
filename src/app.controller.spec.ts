import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let appService: jest.Mocked<AppService>;

  beforeEach(async () => {
    const mockAppService = {
      getHello: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHello', () => {
    it('should return message from service', () => {
      const expectedMessage = 'IFCode Server API is running!';
      appService.getHello.mockReturnValue(expectedMessage);

      const result = controller.getHello();

      expect(appService.getHello).toHaveBeenCalled();
      expect(result).toBe(expectedMessage);
    });

    it('should call service method once', () => {
      appService.getHello.mockReturnValue('test message');

      controller.getHello();

      expect(appService.getHello).toHaveBeenCalledTimes(1);
    });
  });
});