import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      const createdUser = { ...mockUser };

      usersService.create.mockResolvedValue(createdUser as any);

      const result = await controller.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });

    it('should propagate service errors', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      const error = new Error('User already exists');
      usersService.create.mockRejectedValue(error);

      await expect(controller.create(createUserDto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        mockUser,
        { ...mockUser, id: 2, email: 'test2@example.com' },
      ];

      usersService.findAll.mockResolvedValue(users as any);

      const result = await controller.findAll();

      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should return empty array when no users', async () => {
      usersService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Database connection failed');
      usersService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      const userId = '1';

      usersService.findOne.mockResolvedValue(mockUser as any);

      const result = await controller.findOne(userId);

      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should convert string id to number', async () => {
      const userId = '123';

      usersService.findOne.mockResolvedValue(mockUser as any);

      await controller.findOne(userId);

      expect(usersService.findOne).toHaveBeenCalledWith(123);
    });

    it('should propagate service errors', async () => {
      const userId = '999';
      const error = new Error('User not found');
      usersService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(userId)).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    it('should update user by id', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const updatedUser = { ...mockUser, ...updateUserDto };

      usersService.update.mockResolvedValue(updatedUser as any);

      const result = await controller.update(userId, updateUserDto);

      expect(usersService.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should convert string id to number', async () => {
      const userId = '456';
      const updateUserDto: UpdateUserDto = {
        email: 'newemail@example.com',
      };

      usersService.update.mockResolvedValue(mockUser as any);

      await controller.update(userId, updateUserDto);

      expect(usersService.update).toHaveBeenCalledWith(456, updateUserDto);
    });

    it('should propagate service errors', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        email: 'existing@example.com',
      };

      const error = new Error('Email already exists');
      usersService.update.mockRejectedValue(error);

      await expect(controller.update(userId, updateUserDto)).rejects.toThrow(error);
    });
  });

  describe('remove', () => {
    it('should remove user by id', async () => {
      const userId = '1';

      usersService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(userId);

      expect(usersService.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });

    it('should convert string id to number', async () => {
      const userId = '789';

      usersService.remove.mockResolvedValue(undefined);

      await controller.remove(userId);

      expect(usersService.remove).toHaveBeenCalledWith(789);
    });

    it('should propagate service errors', async () => {
      const userId = '999';
      const error = new Error('User not found');
      usersService.remove.mockRejectedValue(error);

      await expect(controller.remove(userId)).rejects.toThrow(error);
    });
  });
});