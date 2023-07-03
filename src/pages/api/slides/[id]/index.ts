import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { slideValidationSchema } from 'validationSchema/slides';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.slide
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getSlideById();
    case 'PUT':
      return updateSlideById();
    case 'DELETE':
      return deleteSlideById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSlideById() {
    const data = await prisma.slide.findFirst(convertQueryToPrismaUtil(req.query, 'slide'));
    return res.status(200).json(data);
  }

  async function updateSlideById() {
    await slideValidationSchema.validate(req.body);
    const data = await prisma.slide.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteSlideById() {
    const data = await prisma.slide.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
