import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'User full name', example: 'Eduardo Olimpio' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User experience description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
