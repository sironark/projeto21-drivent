import { TicketStatus } from '@prisma/client';
import { aboveCapacity, notFoundError } from '@/errors';
import { bookingRepository, enrollmentRepository, ticketsRepository } from '@/repositories';

async function validateUserBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const type = ticket.TicketType;

  if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
    throw aboveCapacity(`ticket not paid, does not include hotel or remote reservation`);
  }
}

async function getBooking(userId: number) {
  await validateUserBooking(userId);

  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) throw notFoundError();

  return {
    id: booking.id,
    Room: booking.Room,
  };
}

async function postBooking(userId: number, roomId: number) {
  await validateUserBooking(userId);

  const room = await bookingRepository.findUniqueRoom(roomId);
  if (!room) throw notFoundError();

  const reserveds = await bookingRepository.findRoomById(roomId);

  if (reserveds.length >= room.capacity) throw aboveCapacity('Above Capacity');

  const isReserved = await bookingRepository.findBookingByUserId(userId);
  if (isReserved) throw aboveCapacity('Reserve one room only - forbidden action');

  const generateBooking = await bookingRepository.genBooking(userId, roomId);

  return {
    bookingId: generateBooking.id,
  };
}

async function changeBooking(roomId: number, bookingId: number, userId: number) {
  await validateUserBooking(userId);

  const room = await bookingRepository.findUniqueRoom(roomId);
  if (!room) throw notFoundError();

  const reserveds = await bookingRepository.findRoomById(roomId);
  if (reserveds.length >= room.capacity) throw aboveCapacity('Above Capacity');

  const booking = await bookingRepository.findUniqueBooking(Number(bookingId));
  if (!booking) throw aboveCapacity('user does not has booking - forbidden action');

  const changedBooking = await bookingRepository.updateBooking(booking.id, roomId);

  return {
    bookingId: changedBooking.id,
  };
}

export const bookingService = {
  getBooking,
  postBooking,
  changeBooking,
};
