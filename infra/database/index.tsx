export default interface IDatabase {
  query<T>(query: string, params?: []): Promise<T[]>;
}
