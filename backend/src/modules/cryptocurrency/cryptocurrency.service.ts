import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CryptocurrencyDto, CryptocurrencyQueryDto } from './dto/cryptocurrency.dto';

@Injectable()
export class CryptocurrencyService {
  private readonly logger = new Logger(CryptocurrencyService.name);
  private readonly apiUrl: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('COINPAPRIKA_API_URL') || 'https://api.coinpaprika.com/v1';
  }

  async getAllCryptocurrencies(query: CryptocurrencyQueryDto): Promise<CryptocurrencyDto[]> {
    const startTime = Date.now();
    const cacheKey = `cryptos:all:${JSON.stringify(query)}`;
    
    const cached = await this.cacheManager.get<CryptocurrencyDto[]>(cacheKey);
    if (cached) {
      const responseTime = Date.now() - startTime;
      this.logger.log(`🚀 CACHE HIT - Response time: ${responseTime}ms - Key: ${cacheKey}`);
      return cached;
    }

    try {
      const tickersResponse = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/tickers`, {
          params: {
            limit: query.limit || 100,
            start: query.offset || 0,
          },
        }),
      );

      let cryptocurrencies: CryptocurrencyDto[] = tickersResponse.data.map((crypto: any) => ({
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        rank: crypto.rank,
        price_usd: crypto.quotes?.USD?.price || 0,
        market_cap_usd: crypto.quotes?.USD?.market_cap || 0,
        volume_24h_usd: crypto.quotes?.USD?.volume_24h || 0,
        percent_change_1h: crypto.quotes?.USD?.percent_change_1h || 0,
        percent_change_24h: crypto.quotes?.USD?.percent_change_24h || 0,
        percent_change_7d: crypto.quotes?.USD?.percent_change_7d || 0,
        type: crypto.type || 'coin',
        last_updated: crypto.last_updated,
      }));

      if (query.name) {
        cryptocurrencies = cryptocurrencies.filter(crypto =>
          crypto.name.toLowerCase().includes(query.name.toLowerCase())
        );
      }

      if (query.symbol) {
        cryptocurrencies = cryptocurrencies.filter(crypto =>
          crypto.symbol.toLowerCase().includes(query.symbol.toLowerCase())
        );
      }

      if (query.type) {
        cryptocurrencies = cryptocurrencies.filter(crypto =>
          crypto.type.toLowerCase().includes(query.type.toLowerCase())
        );
      }

      await this.cacheManager.set(cacheKey, cryptocurrencies, 300000);
      
      const responseTime = Date.now() - startTime;
      this.logger.log(`⚡ CACHE MISS - API call completed in ${responseTime}ms - Cached ${cryptocurrencies.length} cryptocurrencies`);
      return cryptocurrencies;

    } catch (error) {
      this.logger.error('Error fetching cryptocurrency data:', error.message);
      throw new Error('Failed to fetch cryptocurrency data');
    }
  }

  async getCryptocurrencyById(id: string): Promise<CryptocurrencyDto> {
    const cacheKey = `crypto:${id}`;
    
    const cached = await this.cacheManager.get<CryptocurrencyDto>(cacheKey);
    if (cached) {
      this.logger.debug(`Returning cached data for cryptocurrency: ${id}`);
      return cached;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/tickers/${id}`),
      );

      const crypto = response.data;
      const cryptocurrency: CryptocurrencyDto = {
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        rank: crypto.rank,
        price_usd: crypto.quotes?.USD?.price || 0,
        market_cap_usd: crypto.quotes?.USD?.market_cap || 0,
        volume_24h_usd: crypto.quotes?.USD?.volume_24h || 0,
        percent_change_1h: crypto.quotes?.USD?.percent_change_1h || 0,
        percent_change_24h: crypto.quotes?.USD?.percent_change_24h || 0,
        percent_change_7d: crypto.quotes?.USD?.percent_change_7d || 0,
        type: crypto.type || 'coin',
        last_updated: crypto.last_updated,
      };

      await this.cacheManager.set(cacheKey, cryptocurrency, 120000);
      
      this.logger.debug(`Fetched cryptocurrency data for: ${id}`);
      return cryptocurrency;

    } catch (error) {
      this.logger.error(`Error fetching cryptocurrency ${id}:`, error.message);
      throw new Error(`Failed to fetch cryptocurrency data for ${id}`);
    }
  }

  async getTopCryptocurrencies(limit: number = 10): Promise<CryptocurrencyDto[]> {
    return this.getAllCryptocurrencies({ limit, offset: 0 });
  }

  async searchCryptocurrencies(searchTerm: string): Promise<CryptocurrencyDto[]> {
    const cacheKey = `crypto:search:${searchTerm.toLowerCase()}`;
    
    const cached = await this.cacheManager.get<CryptocurrencyDto[]>(cacheKey);
    if (cached) {
      this.logger.debug(`Returning cached search results for: ${searchTerm}`);
      return cached;
    }

    try {
      const allCryptos = await this.getAllCryptocurrencies({ limit: 1000 });
      const searchResults = allCryptos.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );

      await this.cacheManager.set(cacheKey, searchResults, 600000);
      
      this.logger.debug(`Found ${searchResults.length} cryptocurrencies matching: ${searchTerm}`);
      return searchResults;

    } catch (error) {
      this.logger.error(`Error searching cryptocurrencies for ${searchTerm}:`, error.message);
      throw new Error(`Failed to search cryptocurrencies for ${searchTerm}`);
    }
  }

  async clearCache(): Promise<void> {
    await this.cacheManager.reset();
    this.logger.debug('Cryptocurrency cache cleared');
  }
}
