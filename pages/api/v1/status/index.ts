import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import database from "@infra/database/postgres/PostgresDatabase";

export const status: NextApiHandler = async (
  request: NextApiRequest,
  response: NextApiResponse,
) => {
  const updatedAt = new Date().toISOString();
  const dbMetadata = await database.getMetadata();

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbMetadata.version,
        max_connections: dbMetadata.maxConnections,
        used_connections: dbMetadata.usedConnections,
      },
    },
  });
};

export default status;
