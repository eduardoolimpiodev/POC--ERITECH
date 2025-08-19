import { Controller, Get, Delete, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CryptocurrencyService } from '../cryptocurrency/cryptocurrency.service';

@ApiTags('Cache Testing')
@Controller('cache-test')
export class CacheTestController {
  constructor(
    private readonly cryptoService: CryptocurrencyService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('crypto-performance')
  @ApiOperation({ summary: 'Test cryptocurrency cache performance' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async testCryptoPerformance(@Query('limit') limit?: number) {
    const startTime = Date.now();
    
    const cryptos = await this.cryptoService.getAllCryptocurrencies({ 
      limit: limit || 10 
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    return {
      success: true,
      responseTime: `${responseTime}ms`,
      dataCount: cryptos.length,
      timestamp: new Date().toISOString(),
      message: responseTime < 100 ? 'CACHE HIT - Fast response!' : 'CACHE MISS - API call made',
      data: cryptos.slice(0, 5)
    };
  }

  @Get('cache-info')
  @ApiOperation({ summary: 'Get cache information and keys' })
  async getCacheInfo() {
    try {
      const keys = await this.cacheManager.store.keys?.() || [];
      
      return {
        success: true,
        cacheStore: 'redis',
        totalKeys: Array.isArray(keys) ? keys.length : 'Unknown',
        sampleKeys: Array.isArray(keys) ? keys.slice(0, 10) : [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Could not retrieve cache keys (normal for some cache stores)',
        timestamp: new Date().toISOString()
      };
    }
  }

  @Delete('clear-cache')
  @ApiOperation({ summary: 'Clear all cache (use with caution)' })
  async clearCache() {
    try {
      await this.cacheManager.reset();
      
      return {
        success: true,
        message: 'Cache cleared successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('performance-comparison')
  @ApiOperation({ summary: 'Compare performance: clear cache, call API twice' })
  async performanceComparison() {
    const results = [];
    
    await this.cacheManager.reset();
    
    const start1 = Date.now();
    const data1 = await this.cryptoService.getAllCryptocurrencies({ limit: 5 });
    const time1 = Date.now() - start1;
    
    results.push({
      call: 1,
      type: 'CACHE MISS',
      responseTime: `${time1}ms`,
      dataCount: data1.length
    });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const start2 = Date.now();
    const data2 = await this.cryptoService.getAllCryptocurrencies({ limit: 5 });
    const time2 = Date.now() - start2;
    
    results.push({
      call: 2,
      type: 'CACHE HIT',
      responseTime: `${time2}ms`,
      dataCount: data2.length
    });
    
    const improvement = time1 > 0 ? ((time1 - time2) / time1 * 100).toFixed(1) : 0;
    
    return {
      success: true,
      results,
      performance: {
        improvementPercentage: `${improvement}%`,
        timeSaved: `${time1 - time2}ms`,
        speedupFactor: time2 > 0 ? `${(time1 / time2).toFixed(1)}x` : 'N/A'
      },
      timestamp: new Date().toISOString()
    };
  }
}
