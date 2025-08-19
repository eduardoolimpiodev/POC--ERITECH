import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/schemas/user.schema';

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ description: 'User information', type: User })
  user: User;

  @ApiProperty({ description: 'Token type', example: 'Bearer' })
  token_type: string;

  @ApiProperty({ description: 'Token expiration time in seconds', example: 604800 })
  expires_in: number;
}
