import { prisma } from '@/config';

async function findFirst() {
  return prisma.event.findFirst();
}
async function getTicketTypes() {
  const answare = await prisma.ticketType.findMany();
  return answare;
}
async function getTicket(userId: number) {
  const answare = await prisma.enrollment.findUnique({
    where: { userId },
    include: { Ticket: true },
  });
  return answare;
}

export const eventRepository = {
  findFirst,
  getTicketTypes,
  getTicket,
};
