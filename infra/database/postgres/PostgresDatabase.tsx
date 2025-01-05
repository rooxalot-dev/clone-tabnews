import { Pool, PoolClient } from "pg";

import { IDatabase } from "../IDatabase";
import DbMetadata from "../DbMetadata";

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
}

export default new PostgresDatabase();
