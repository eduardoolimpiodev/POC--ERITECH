import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'User full name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'User experience description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'User active status', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
