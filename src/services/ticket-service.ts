import { eventRepository } from '@/repositories';

async function getTypesServices() {
  const answare = await eventRepository.getTicketTypes();

  return answare;
}

export const ticketsService = {
  getTypesServices,
};
