import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CryptocurrencyDto {
  @ApiProperty({ description: 'Cryptocurrency ID', example: 'btc-bitcoin' })
  id: string;

  @ApiProperty({ description: 'Cryptocurrency name', example: 'Bitcoin' })
  name: string;

  @ApiProperty({ description: 'Cryptocurrency symbol', example: 'BTC' })
  symbol: string;

  @ApiProperty({ description: 'Current rank', example: 1 })
  rank: number;

  @ApiProperty({ description: 'Current price in USD', example: 45000.50 })
  price_usd: number;

  @ApiProperty({ description: 'Market cap in USD', example: 850000000000 })
  market_cap_usd: number;

  @ApiProperty({ description: 'Volume 24h in USD', example: 25000000000 })
  volume_24h_usd: number;

  @ApiProperty({ description: 'Percent change 1h', example: 0.5 })
  percent_change_1h: number;

  @ApiProperty({ description: 'Percent change 24h', example: -2.3 })
  percent_change_24h: number;

  @ApiProperty({ description: 'Percent change 7d', example: 15.8 })
  percent_change_7d: number;

  @ApiProperty({ description: 'Cryptocurrency type/category', example: 'coin' })
  type: string;

  @ApiProperty({ description: 'Last updated timestamp' })
  last_updated: string;
}

export class CryptocurrencyQueryDto {
  @ApiProperty({ description: 'Search by name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Search by symbol', required: false })
  @IsOptional()
  @IsString()
  symbol?: string;

  @ApiProperty({ description: 'Search by type/category', required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: 'Limit results', required: false, default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ description: 'Offset for pagination', required: false, default: 0 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  offset?: number;
}
