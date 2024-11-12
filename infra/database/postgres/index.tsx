import { Client } from "pg";

import IDatabase from "..";

export class PostgresDatabase implements IDatabase {
  client: Client;

  constructor() {
    this.client = new Client({
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT ?? "0"),
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    });
  }

  async query<T>(query: string, params?: []): Promise<T[]> {
    try {
      await this.client.connect();
      const result = await this.client.query<T>(query, params);
      return result.rows;
    } catch (error) {
      throw new Error(`Error querying the database: ${error}`);
    } finally {
      this.client.end();
    }
  }
}

export default new PostgresDatabase();
