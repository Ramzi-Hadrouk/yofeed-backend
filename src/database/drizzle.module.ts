// drizzle.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleService } from './drizzle.service';
import { databaseConfig } from 'src/config/database.config'; // if using registerAs

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig) // Loads only database config
  ],
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DrizzleModule {}
