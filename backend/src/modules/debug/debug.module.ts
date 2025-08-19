import { Module } from '@nestjs/common';
import { DebugController } from './debug.controller';
import { CacheTestController } from './cache-test.controller';
import { UserModule } from '../user/user.module';
import { CryptocurrencyModule } from '../cryptocurrency/cryptocurrency.module';

@Module({
  imports: [UserModule, CryptocurrencyModule],
  controllers: [DebugController, CacheTestController],
})
export class DebugModule {}
