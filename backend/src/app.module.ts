import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CryptocurrencyModule } from './modules/cryptocurrency/cryptocurrency.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { DebugModule } from './modules/debug/debug.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/erictel',
      }),
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: 'redis',
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        ttl: 300,
      }),
    }),

    AuthModule,
    UserModule,
    CryptocurrencyModule,
    FileUploadModule,
    DebugModule,
  ],
})
export class AppModule {}
