import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthResult = {
    access_token: 'jwt.token.here',
    user: {
      id: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
  };

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      validateGoogleUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      authService.register.mockResolvedValue(mockAuthResult);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockAuthResult);
    });

    it('should propagate service errors', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };

      const error = new Error('User already exists');
      authService.register.mockRejectedValue(error);

      await expect(controller.register(registerDto)).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      authService.login.mockResolvedValue(mockAuthResult);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockAuthResult);
    });

    it('should propagate service errors', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const error = new Error('Invalid credentials');
      authService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(error);
    });
  });

  describe('googleAuth', () => {
    it('should initiate Google OAuth', async () => {
      const req = { user: null };

      // This method doesn't return anything as the guard handles the redirect
      const result = await controller.googleAuth(req);

      expect(result).toBeUndefined();
    });
  });

  describe('googleAuthRedirect', () => {
    it('should handle Google OAuth callback', async () => {
      const req = {
        user: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          googleId: 'google123',
        },
      };

      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      authService.validateGoogleUser.mockResolvedValue(mockAuthResult);

      await controller.googleAuthRedirect(req, mockResponse);

      expect(authService.validateGoogleUser).toHaveBeenCalledWith(req.user);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAuthResult);
    });

    it('should propagate service errors', async () => {
      const req = {
        user: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          googleId: 'google123',
        },
      };

      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      const error = new Error('Google validation failed');
      authService.validateGoogleUser.mockRejectedValue(error);

      await expect(controller.googleAuthRedirect(req, mockResponse)).rejects.toThrow(error);
    });
  });
});