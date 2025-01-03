export interface IDatabase {
  query<T>(query: string, params?: []): Promise<T[]>;
}

export default IDatabase;
