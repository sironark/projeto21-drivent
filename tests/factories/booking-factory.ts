import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function genBooking(userId: number = null, roomId: number = null) {
  return await prisma.booking.create({
    data: {
      id: faker.datatype.number(),
      roomId: roomId === null ? faker.datatype.number() : roomId,
      userId: userId === null ? faker.datatype.number() : userId,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
  });
}
