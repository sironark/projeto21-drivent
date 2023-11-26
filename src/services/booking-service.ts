import { TicketStatus } from '@prisma/client';
import { aboveCapacity, notFoundError } from '@/errors';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';
import { bookingRepository, enrollmentRepository, ticketsRepository } from '@/repositories';

async function validateUserBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const type = ticket.TicketType;

  if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
    throw cannotListHotelsError();
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

export const bookingService = {
  getBooking,
  postBooking,
};
