import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    toObject: jest.fn().mockReturnValue({
      _id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      name: 'Test User',
    }),
  };

  const mockUserService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    validatePassword: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data if credentials are valid', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockUserService.validatePassword.mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toEqual({
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    it('should return null if credentials are invalid', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockUserService.validatePassword.mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return auth response for valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser.toObject());
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        access_token: 'jwt-token',
        user: mockUser.toObject(),
        token_type: 'Bearer',
        expires_in: 604800,
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create user and return auth response', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };

      mockUserService.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(createUserDto);

      expect(result).toEqual({
        access_token: 'jwt-token',
        user: mockUser,
        token_type: 'Bearer',
        expires_in: 604800,
      });
    });
  });
});
