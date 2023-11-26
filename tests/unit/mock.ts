import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';

export const mockEnrollment = {
  id: 1,
  name: faker.name.firstName(),
  cpf: faker.name.lastName(),
  birthday: new Date(),
  phone: faker.phone.phoneNumber('+55 ## 9####-####'),
  userId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  Address: [
    {
      id: 1,
      cep: faker.address.zipCode(),
      street: faker.address.streetName(),
      city: faker.address.city(),
      state: faker.address.state(),
      number: faker.address.buildingNumber(),
      neighborhood: faker.address.state(),
      addressDetail: faker.address.streetAddress() || null,
      enrollmentId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};
export const mockTicket = {
  id: 1,
  ticketTypeId: 1,
  enrollmentId: mockEnrollment.id,
  status: TicketStatus.RESERVED,
  createdAt: new Date(),
  updatedAt: new Date(),
  TicketType: {
    id: 1,
    name: faker.name.jobArea(),
    price: 100,
    isRemote: false,
    includesHotel: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const mockTicket2 = {
  id: 1,
  ticketTypeId: 1,
  enrollmentId: mockEnrollment.id,
  status: TicketStatus.PAID,
  createdAt: new Date(),
  updatedAt: new Date(),
  TicketType: {
    id: 1,
    name: faker.name.jobArea(),
    price: 100,
    isRemote: true,
    includesHotel: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};
