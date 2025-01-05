export class DbMetadata {
  constructor(
    public version: number,
    public maxConnections: number,
    public usedConnections: number,
  ) {
  }
};

export default DbMetadata;
