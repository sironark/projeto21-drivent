import { eventRepository } from '@/repositories';

async function getTypesServices() {
  const answare = await eventRepository.getTicketTypes();

  return answare;
}
async function getTicketServices(userId: number) {
  const answare = await eventRepository.getTicket(userId);

  return answare;
}

export const ticketsService = {
  getTypesServices,
  getTicketServices,
};
