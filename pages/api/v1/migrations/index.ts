import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import database from '@infra/database/postgres/PostgresDatabase';

export const migrations: NextApiHandler = async (
  request: NextApiRequest,
  response: NextApiResponse,
) => {
  const migrations = await database.getMigrations(false);
  response.status(200).json(migrations);
};

export default migrations;
