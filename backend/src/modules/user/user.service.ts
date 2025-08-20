import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto, profileImage?: Express.Multer.File): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    
    let profileImagePath: string | undefined;
    
    if (profileImage) {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const timestamp = Date.now();
      const extension = path.extname(profileImage.originalname);
      const filename = `profile-${timestamp}${extension}`;
      const filepath = path.join(uploadsDir, filename);
      
      fs.writeFileSync(filepath, profileImage.buffer);
      profileImagePath = `/uploads/${filename}`;
    }
    
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      profileImage: profileImagePath,
    });

    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({ isActive: true }).exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async updateProfileImage(id: string, imagePath: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { profileImage: imagePath }, { new: true })
      .exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).exec();
    
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
