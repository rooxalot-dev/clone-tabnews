import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import database from "@infra/database/postgres/PostgresDatabase";

export const status: NextApiHandler = async (
  request: NextApiRequest,
  response: NextApiResponse,
) => {
  const result = await database.query("SELECT 1 + 1 as result;");

  response.status(200).json({
    api: 200,
    database: result ? 200 : 500,
  });
};

export default status;
