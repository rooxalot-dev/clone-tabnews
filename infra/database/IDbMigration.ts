export interface IDbMigration {
  name: string,
  path: string,
  timestamp: string | number,
}
