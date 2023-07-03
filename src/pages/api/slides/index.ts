import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { slideValidationSchema } from 'validationSchema/slides';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getSlides();
    case 'POST':
      return createSlide();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSlides() {
    const data = await prisma.slide
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'slide'));
    return res.status(200).json(data);
  }

  async function createSlide() {
    await slideValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.poll?.length > 0) {
      const create_poll = body.poll;
      body.poll = {
        create: create_poll,
      };
    } else {
      delete body.poll;
    }
    const data = await prisma.slide.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
