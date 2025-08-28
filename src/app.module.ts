import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

import { validateEnv } from './config/env.validation';
import { appConfig } from './config/app.config';
import { DrizzleModule } from './database/drizzle.module';
import { UsersModule } from './users/users.module';
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [appConfig],
      validate: validateEnv,
      cache: true,
    }),
  
    // Rate limiting
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [
          {
            ttl: 60000, // 1 minute
            limit: parseInt(process.env.API_RATE_LIMIT || '100', 10),
          },
        ],
      }),
    }),

    // Logging
    WinstonModule.forRootAsync({
      useFactory: () => {
        const transports: winston.transport[] = [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.colorize(),
              winston.format.simple(),
            ),
          }),
        ];

        if (process.env.LOG_FILE_ENABLED === 'true') {
          transports.push(
            new winston.transports.DailyRotateFile({
              filename: 'logs/application-%DATE%.log',
              datePattern: 'YYYY-MM-DD',
              maxSize: '20m',
              maxFiles: '14d',
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
              ),
            }),
          );
        }

        return {
          level: process.env.LOG_LEVEL || 'info',
          transports,
        };
      },
    }),

    // Database
    DrizzleModule,

    UsersModule,

    // Your feature modules will go here
  ],
  controllers: [ ],
  providers: [ ],
})
export class AppModule {}