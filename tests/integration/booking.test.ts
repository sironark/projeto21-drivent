import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { TicketStatus, User } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createPayment,
  createTicket,
  createTicketType,
  createUser,
  genBooking,
} from '../factories';
import { createHotel, createRoomWithHotelId } from '../factories/hotels-factory';
import app, { init } from '@/app';

async function generateAllData(isRemote: boolean, includesHotel: boolean) {
  const user: User = await createUser();
  const token = await generateValidToken(user);

  const enrollment = await createEnrollmentWithAddress(user);
  const ticketType = await createTicketType(isRemote, includesHotel);
  const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

  await createPayment(ticket.id, ticketType.price);
  const hotel = await createHotel();
  const room = await createRoomWithHotelId(hotel.id);
  const booking = await genBooking(user.id, room.id);
  return { user, token, room, enrollment, hotel, booking };
}

async function generateDataDevoidBooking(isRemote: boolean, includesHotel: boolean) {
  const user: User = await createUser();
  const token = await generateValidToken(user);

  const enrollment = await createEnrollmentWithAddress(user);
  const ticketType = await createTicketType(isRemote, includesHotel);
  const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

  await createPayment(ticket.id, ticketType.price);
  const hotel = await createHotel();
  const room = await createRoomWithHotelId(hotel.id);
  return { user, token, room, enrollment, hotel };
}

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('When token is ok', () => {
    it('should responde status 200 and return all booking data', async () => {
      const { token, booking, room } = await generateAllData(false, true);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toMatchObject({
        id: booking.id,
        Room: {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: room.hotelId,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        },
      });
    });
  });
});

describe('Post /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('When token is ok', () => {
    it('should return status 200 and booking id', async () => {
      const { room, token } = await generateDataDevoidBooking(false, true);
      const body = {
        roomId: room.id,
      };
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({ bookingId: expect.any(Number) });
    });

    it('should return status 404 when roomId not found', async () => {
      const { token } = await generateDataDevoidBooking(false, true);
      const body = { roomId: 99999 };
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return status 403 when capacity of room was reached', async () => {
      const { room } = await generateAllData(false, true);
      const otherRoom = await generateDataDevoidBooking(false, true);
      const body = { roomId: room.id };

      const response = await server.post('/booking').set('Authorization', `Bearer ${otherRoom.token}`).send(body);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
  });
});

describe('Put /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('When token is ok!', () => {
    it('should return whith status 200 and bookingId', async () => {
      const { token, booking } = await generateAllData(false, true);
      const otherRoom = await generateDataDevoidBooking(false, true);
      const response = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: otherRoom.room.id });
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({ bookingId: expect.any(Number) });
    });
  });
});
