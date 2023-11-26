import { prisma } from '@/config';

async function findBookingByUserId(userId: number) {
  return prisma.booking.findUnique({
    where: { userId },
    include: { Room: true },
  });
}

async function findRoomById(roomId: number) {
  return prisma.booking.findMany({
    where: { roomId },
  });
}

async function findUniqueRoom(id: number) {
  return prisma.room.findUnique({
    where: { id },
  });
}

async function genBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: { userId, roomId },
  });
}

async function findUniqueBooking(bookingId: number) {
  return prisma.booking.findUnique({
    where: { id: bookingId },
  });
}

async function updateBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: { roomId },
  });
}

export const bookingRepository = {
  findBookingByUserId,
  findRoomById,
  findUniqueRoom,
  genBooking,
  findUniqueBooking,
  updateBooking,
};
