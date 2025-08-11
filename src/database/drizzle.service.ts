import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool, PoolClient } from 'pg';
import { databaseConfig } from '../config/database.config';
import * as schema from './schema';

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  private pool: Pool;
  public db: NodePgDatabase<typeof schema>;

  constructor(
    @Inject(databaseConfig.KEY)
    private dbConfig: ConfigType<typeof databaseConfig>,
  ) {
    this.pool = new Pool({
      host: this.dbConfig.host,
      port: this.dbConfig.port,
      user: this.dbConfig.username,
      password: this.dbConfig.password,
      database: this.dbConfig.database,
      min: this.dbConfig.pool.min,
      max: this.dbConfig.pool.max,
      idleTimeoutMillis: this.dbConfig.pool.idleTimeoutMillis,
      connectionTimeoutMillis: this.dbConfig.pool.connectionTimeoutMillis,
    });

    this.db = drizzle(this.pool, { schema });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async getPoolStatus() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}