import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'hashedPassword',
    googleId: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByGoogleId: jest.fn(),
      update: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return access token', async () => {
      const registerDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      const createdUser = { ...mockUser };
      const expectedToken = 'jwt.token.here';

      usersService.create.mockResolvedValue(createdUser);
      jwtService.sign.mockReturnValue(expectedToken);

      const result = await service.register(registerDto);

      expect(usersService.create).toHaveBeenCalledWith(registerDto);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: createdUser.email,
        sub: createdUser.id,
      });
      expect(result).toEqual({
        access_token: expectedToken,
        user: {
          id: createdUser.id,
          email: createdUser.email,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
        },
      });
    });

    it('should propagate errors from users service', async () => {
      const registerDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      usersService.create.mockRejectedValue(new Error('User already exists'));

      await expect(service.register(registerDto)).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should login user and return access token', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const validatedUser = { ...mockUser };
      const expectedToken = 'jwt.token.here';

      jest.spyOn(service, 'validateUser').mockResolvedValue(validatedUser);
      jwtService.sign.mockReturnValue(expectedToken);

      const result = await service.login(loginDto);

      expect(service.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: validatedUser.email,
        sub: validatedUser.id,
      });
      expect(result).toEqual({
        access_token: expectedToken,
        user: {
          id: validatedUser.id,
          email: validatedUser.email,
          firstName: validatedUser.firstName,
          lastName: validatedUser.lastName,
        },
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('validateUser', () => {
    it('should return user data without password for valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const userWithPassword = { ...mockUser, password: 'hashedPassword' };

      usersService.findByEmail.mockResolvedValue(userWithPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(email, password);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, userWithPassword.password);
      expect(result).toEqual({ ...userWithPassword, password: undefined });
    });

    it('should return null for invalid email', async () => {
      const email = 'invalid@example.com';
      const password = 'password123';

      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });

    it('should return null for invalid password', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const userWithPassword = { ...mockUser, password: 'hashedPassword' };

      usersService.findByEmail.mockResolvedValue(userWithPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });

    it('should return null if user has no password', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const userWithoutPassword = { ...mockUser, password: null };

      usersService.findByEmail.mockResolvedValue(userWithoutPassword);

      const result = await service.validateUser(email, password);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });
  });

  describe('validateGoogleUser', () => {
    it('should return existing user with Google ID', async () => {
      const googleUser = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        googleId: 'google123',
      };

      const existingUser = { ...mockUser, googleId: 'google123' };
      const expectedToken = 'jwt.token.here';

      usersService.findByGoogleId.mockResolvedValue(existingUser);
      jwtService.sign.mockReturnValue(expectedToken);

      const result = await service.validateGoogleUser(googleUser);

      expect(usersService.findByGoogleId).toHaveBeenCalledWith(googleUser.googleId);
      expect(result).toEqual({
        access_token: expectedToken,
        user: {
          id: existingUser.id,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
        },
      });
    });

    it('should create new user if none exists', async () => {
      const googleUser = {
        email: 'newuser@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        googleId: 'google456',
      };

      const newUser = { ...mockUser, ...googleUser, id: 2 };
      const expectedToken = 'jwt.token.here';

      usersService.findByGoogleId.mockResolvedValue(null);
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(newUser);
      jwtService.sign.mockReturnValue(expectedToken);

      const result = await service.validateGoogleUser(googleUser);

      expect(usersService.findByGoogleId).toHaveBeenCalledWith(googleUser.googleId);
      expect(usersService.findByEmail).toHaveBeenCalledWith(googleUser.email);
      expect(usersService.create).toHaveBeenCalledWith(googleUser);
      expect(result).toEqual({
        access_token: expectedToken,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      });
    });

    it('should update existing user with Google ID', async () => {
      const googleUser = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        googleId: 'google789',
      };

      const existingUser = { ...mockUser };
      const updatedUser = { ...existingUser, googleId: googleUser.googleId };
      const expectedToken = 'jwt.token.here';

      usersService.findByGoogleId.mockResolvedValue(null);
      usersService.findByEmail.mockResolvedValue(existingUser);
      usersService.update.mockResolvedValue(updatedUser);
      jwtService.sign.mockReturnValue(expectedToken);

      const result = await service.validateGoogleUser(googleUser);

      expect(usersService.update).toHaveBeenCalledWith(existingUser.id, {
        googleId: googleUser.googleId,
      });
      expect(result).toEqual({
        access_token: expectedToken,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
        },
      });
    });
  });
});