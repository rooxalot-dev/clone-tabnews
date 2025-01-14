import DbMetadata from "@infra/database/DbMetadata";
import { IDbMigration } from "./IDbMigration";

export interface IDatabase {
  query<T>(query: string, params?: any[]): Promise<T[]>;
  getMetadata(): Promise<DbMetadata>;
  getMigrations(runMigrations: boolean): Promise<IDbMigration[]>;
}

export default IDatabase;
