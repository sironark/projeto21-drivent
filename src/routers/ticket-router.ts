import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { typecontroller } from '@/controllers';

const ticketRouter = Router();

ticketRouter.all('/*', authenticateToken).get('/types', typecontroller.getTypesController);

export { ticketRouter };
