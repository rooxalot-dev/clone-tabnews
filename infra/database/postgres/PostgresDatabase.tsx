import { Pool, PoolClient } from "pg";
import migrationRunner, { RunnerOption } from "node-pg-migrate";

import { IDatabase } from "../IDatabase";
import DbMetadata from "../DbMetadata";
import path from "path";
import status from "@pages/api/v1/status";
import { IDbMigration } from "../IDbMigration";

export class PostgresDatabase implements IDatabase {
  pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT ?? "0"),
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      ssl: process.env.ENVIRONMENT === 'production' ? true : false,
    });
  }

  async query<T>(query: string, params?: any[]): Promise<T[]> {
    let poolClient: PoolClient | null = null;

    try {
      poolClient = await this.pool.connect();
      const result = await poolClient.query<T>(query, params);
      return result.rows;
    } catch (error) {
      throw new Error(`Error querying the database: ${error}`);
    } finally {
      poolClient?.release();
    }
  }

  async getMetadata(): Promise<DbMetadata> {
    const responses = await Promise.all([
      this.query<any>('SHOW server_version'),
      this.query<any>('SHOW max_connections'),
      this.query<any>(`SELECT COUNT(*) FROM pg_stat_activity WHERE datname = $1 and state = 'active'`, [process.env.POSTGRES_DB]),
    ]);

    const [
      [version],
      [maxConnections],
      [usedConnections],
    ] = responses;

    return new DbMetadata(
      parseFloat(version.server_version),
      parseInt(maxConnections.max_connections),
      parseInt(usedConnections.count));
  }

  async getMigrations(runMigrations: boolean = false): Promise<IDbMigration[]> {
    const runnerOptions: RunnerOption = {
      databaseUrl: process.env.DATABASE_URL,
      dryRun: !runMigrations,
      direction: 'up',
      migrationsTable: 'pgmigrations',
      dir: path.join('infra', 'database', 'postgres', 'migrations'),
      log: console.log,
    };

    try {
      const migrations = await migrationRunner(runnerOptions);

      return migrations.map(migration => ({
        name: migration.name,
        path: migration.path,
        timestamp: migration.timestamp,
      }));
    } catch (error) {
      console.error('Error running migrations:', error);
    }
  }
}

export default new PostgresDatabase();
