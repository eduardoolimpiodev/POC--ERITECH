import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CryptocurrencyService } from './cryptocurrency.service';
import { CryptocurrencyController } from './cryptocurrency.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  controllers: [CryptocurrencyController],
  providers: [CryptocurrencyService],
  exports: [CryptocurrencyService],
})
export class CryptocurrencyModule {}
