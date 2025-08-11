import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleService } from './drizzle.service';
import { databaseConfig } from '../config/database.config';
import { validateEnv } from '../config/env.validation';


@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DrizzleModule {}
