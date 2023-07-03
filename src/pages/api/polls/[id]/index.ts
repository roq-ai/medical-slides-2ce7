import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { pollValidationSchema } from 'validationSchema/polls';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.poll
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPollById();
    case 'PUT':
      return updatePollById();
    case 'DELETE':
      return deletePollById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPollById() {
    const data = await prisma.poll.findFirst(convertQueryToPrismaUtil(req.query, 'poll'));
    return res.status(200).json(data);
  }

  async function updatePollById() {
    await pollValidationSchema.validate(req.body);
    const data = await prisma.poll.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePollById() {
    const data = await prisma.poll.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
