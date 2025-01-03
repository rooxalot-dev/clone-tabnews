import { Pool, PoolClient } from "pg";

import { IDatabase } from "../IDatabase";

export class PostgresDatabase implements IDatabase {
  pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT ?? "0"),
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    });
  }

  async query<T>(query: string, params?: []): Promise<T[]> {
    let poolClient: PoolClient | null = null;

    try {
      poolClient = await this.pool.connect();
      const result = await poolClient.query<T>(query, params);
      return result.rows;
    } catch (error) {
      throw new Error(`Error querying the database: ${error}`);
    } finally {
      await poolClient?.release();
    }
  }
}

export default new PostgresDatabase();
