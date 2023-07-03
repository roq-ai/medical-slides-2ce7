import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { presentationValidationSchema } from 'validationSchema/presentations';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.presentation
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPresentationById();
    case 'PUT':
      return updatePresentationById();
    case 'DELETE':
      return deletePresentationById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPresentationById() {
    const data = await prisma.presentation.findFirst(convertQueryToPrismaUtil(req.query, 'presentation'));
    return res.status(200).json(data);
  }

  async function updatePresentationById() {
    await presentationValidationSchema.validate(req.body);
    const data = await prisma.presentation.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePresentationById() {
    const data = await prisma.presentation.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
