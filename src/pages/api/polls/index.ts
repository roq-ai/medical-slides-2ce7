import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { pollValidationSchema } from 'validationSchema/polls';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getPolls();
    case 'POST':
      return createPoll();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPolls() {
    const data = await prisma.poll
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'poll'));
    return res.status(200).json(data);
  }

  async function createPoll() {
    await pollValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.response?.length > 0) {
      const create_response = body.response;
      body.response = {
        create: create_response,
      };
    } else {
      delete body.response;
    }
    const data = await prisma.poll.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
