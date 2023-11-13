import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { eventsService, ticketsService } from '@/services';
import { AuthenticatedRequest } from '@/middlewares';

export async function getDefaultEvent(_req: Request, res: Response) {
  const event = await eventsService.getFirstEvent();
  return res.status(httpStatus.OK).send(event);
}

async function getTypesController(req: AuthenticatedRequest, res: Response) {
  const gotTypes = await ticketsService.getTypesServices();

  res.status(httpStatus.OK).send(gotTypes);
}

export const typecontroller = {
  getTypesController,
};
