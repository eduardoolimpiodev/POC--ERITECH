import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CryptocurrencyService } from './cryptocurrency.service';
import { CryptocurrencyDto, CryptocurrencyQueryDto } from './dto/cryptocurrency.dto';

@ApiTags('cryptocurrencies')
@Controller('cryptocurrencies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CryptocurrencyController {
  constructor(private readonly cryptocurrencyService: CryptocurrencyService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cryptocurrencies with optional filters' })
  @ApiResponse({ status: 200, description: 'Cryptocurrencies retrieved successfully', type: [CryptocurrencyDto] })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by name' })
  @ApiQuery({ name: 'symbol', required: false, description: 'Filter by symbol' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by type/category' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit results', type: Number })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset for pagination', type: Number })
  async findAll(@Query() query: CryptocurrencyQueryDto): Promise<CryptocurrencyDto[]> {
    return this.cryptocurrencyService.getAllCryptocurrencies(query);
  }

  @Get('top')
  @ApiOperation({ summary: 'Get top cryptocurrencies by market cap' })
  @ApiResponse({ status: 200, description: 'Top cryptocurrencies retrieved successfully', type: [CryptocurrencyDto] })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of top cryptocurrencies to return', type: Number })
  async getTop(@Query('limit') limit?: number): Promise<CryptocurrencyDto[]> {
    return this.cryptocurrencyService.getTopCryptocurrencies(limit || 10);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search cryptocurrencies by name or symbol' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully', type: [CryptocurrencyDto] })
  @ApiQuery({ name: 'q', required: true, description: 'Search term (name or symbol)' })
  async search(@Query('q') searchTerm: string): Promise<CryptocurrencyDto[]> {
    return this.cryptocurrencyService.searchCryptocurrencies(searchTerm);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cryptocurrency by ID' })
  @ApiResponse({ status: 200, description: 'Cryptocurrency retrieved successfully', type: CryptocurrencyDto })
  @ApiResponse({ status: 404, description: 'Cryptocurrency not found' })
  async findOne(@Param('id') id: string): Promise<CryptocurrencyDto> {
    return this.cryptocurrencyService.getCryptocurrencyById(id);
  }

  @Delete('cache')
  @ApiOperation({ summary: 'Clear cryptocurrency cache' })
  @ApiResponse({ status: 200, description: 'Cache cleared successfully' })
  async clearCache(): Promise<{ message: string }> {
    await this.cryptocurrencyService.clearCache();
    return { message: 'Cryptocurrency cache cleared successfully' };
  }
}
