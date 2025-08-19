import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from '../user/user.service';

@ApiTags('debug')
@Controller('debug')
export class DebugController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  @ApiOperation({ summary: 'Debug: Get all users (including passwords for debug)' })
  async getAllUsersDebug() {
    const users = await this.userService.findAll();
    return {
      count: users.length,
      users: users,
      message: 'Debug endpoint - remover em produção'
    };
  }
}
