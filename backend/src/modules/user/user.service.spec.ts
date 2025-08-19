import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let mockUserModel: any;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    name: 'Test User',
    description: 'Test description',
    profileImage: null,
    isActive: true,
    save: jest.fn(),
    toObject: jest.fn(),
  };

  beforeEach(async () => {
    const mockUserModelValue = {
      findOne: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      constructor: jest.fn().mockResolvedValue(mockUser),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModelValue,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockUserModel = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockUserModel.findOne.mockResolvedValue(null);
      mockUser.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findOne(userId);

      expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockUser, ...updateUserDto }),
      });

      const result = await service.update(userId, updateUserDto);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        updateUserDto,
        { new: true }
      );
      expect(result.name).toBe(updateUserDto.name);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });
});
