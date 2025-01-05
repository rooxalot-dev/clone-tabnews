import DbMetadata from "@infra/database/DbMetadata";

export interface IDatabase {
  query<T>(query: string, params?: any[]): Promise<T[]>;
  getMetadata(): Promise<DbMetadata>;
}

export default IDatabase;
