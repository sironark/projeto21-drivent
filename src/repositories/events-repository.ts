import { prisma } from '@/config';

async function findFirst() {
  return prisma.event.findFirst();
}
async function getTicketTypes() {
  const answare = await prisma.ticketType.findMany();
  return answare;
}

export const eventRepository = {
  findFirst,
  getTicketTypes,
};
