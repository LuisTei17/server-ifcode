import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'hashedPassword',
    googleId: null,
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with password', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword123';
      const savedUser = { ...mockUser };

      repository.findOne.mockResolvedValue(null); // User doesn't exist
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      repository.save.mockResolvedValue(savedUser);

      const result = await service.create(createUserDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: createUserDto.email,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          password: hashedPassword,
        }),
      );
      expect(result).toEqual(savedUser);
    });

    it('should create a new user without password (Google user)', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        googleId: 'google123',
      };

      const savedUser = { ...mockUser, googleId: 'google123', password: null };

      repository.findOne.mockResolvedValue(null);
      repository.save.mockResolvedValue(savedUser);

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: createUserDto.email,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          googleId: createUserDto.googleId,
        }),
      );
      expect(result).toEqual(savedUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      repository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createUserDto)).rejects.toThrow(
        'User with this email already exists',
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      const users = [mockUser, { ...mockUser, id: 2, email: 'test2@example.com' }];

      repository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        select: ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt', 'updatedAt'],
      });
      expect(result).toEqual(users);
    });

    it('should return empty array if no users', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return user by id without password', async () => {
      const userId = 1;

      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(userId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        select: ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt', 'updatedAt'],
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 999;

      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(userId)).rejects.toThrow(`User with ID ${userId} not found`);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email with password', async () => {
      const email = 'test@example.com';

      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      const email = 'notfound@example.com';

      repository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe('findByGoogleId', () => {
    it('should return user by Google ID', async () => {
      const googleId = 'google123';
      const userWithGoogleId = { ...mockUser, googleId };

      repository.findOne.mockResolvedValue(userWithGoogleId);

      const result = await service.findByGoogleId(googleId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { googleId },
      });
      expect(result).toEqual(userWithGoogleId);
    });

    it('should return null if user not found', async () => {
      const googleId = 'notfound';

      repository.findOne.mockResolvedValue(null);

      const result = await service.findByGoogleId(googleId);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const updatedUser = { ...mockUser, ...updateUserDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      repository.update.mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockUser).mockResolvedValueOnce(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(repository.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should hash password when updating password', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        password: 'newPassword123',
      };

      const hashedPassword = 'newHashedPassword';
      const updatedUser = { ...mockUser };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      repository.update.mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockUser).mockResolvedValueOnce(updatedUser);

      await service.update(userId, updateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(repository.update).toHaveBeenCalledWith(userId, {
        password: hashedPassword,
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        email: 'existing@example.com',
      };

      const existingUser = { ...mockUser, id: 2, email: 'existing@example.com' };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      repository.findOne.mockResolvedValue(existingUser);

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(ConflictException);
      await expect(service.update(userId, updateUserDto)).rejects.toThrow(
        'User with this email already exists',
      );
    });

    it('should allow updating to same email', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        email: mockUser.email, // Same email
        firstName: 'Jane',
      };

      const updatedUser = { ...mockUser, firstName: 'Jane' };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      repository.update.mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockUser).mockResolvedValueOnce(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(repository.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 999;
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
      };

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove user successfully', async () => {
      const userId = 1;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
      repository.remove.mockResolvedValue(mockUser);

      await service.remove(userId);

      expect(service.findOne).toHaveBeenCalledWith(userId);
      expect(repository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 999;

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});