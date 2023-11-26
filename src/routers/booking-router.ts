import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBooking, postBooking } from '@/controllers';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/booking', getBooking)
  .post('/booking', postBooking)
  .put('/booking/:bookingId');

export { bookingRouter };
