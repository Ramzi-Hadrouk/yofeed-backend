import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  public db: NodePgDatabase<typeof schema>;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      user: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.database'),
      min: this.configService.get<number>('database.pool.min'),
      max: this.configService.get<number>('database.pool.max'),
      idleTimeoutMillis: this.configService.get<number>('database.pool.idleTimeoutMillis'),
      connectionTimeoutMillis: this.configService.get<number>('database.pool.connectionTimeoutMillis'),
    });

    this.db = drizzle(this.pool, { schema });
  }

  getDb() {
    return this.db;
  }

  async onModuleInit() {
    console.log('✅ Database connected');
  }

  async onModuleDestroy() {
    await this.pool.end();
    console.log('❌ Database disconnected');
  }

  async getPoolStatus() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}
