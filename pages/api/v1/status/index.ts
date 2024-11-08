import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export const status: NextApiHandler = (
  request: NextApiRequest,
  response: NextApiResponse,
) => {
  response.status(200).json({
    chave: "Os alunos do curso.dev são acima da média!",
  });
};

export default status;
