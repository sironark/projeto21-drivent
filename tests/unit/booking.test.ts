import { jest } from '@jest/globals';
import { mockEnrollment, mockTicket, mockTicket2 } from './mock';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { bookingService } from '@/services';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Enrollment Repository paiment and include hotel', () => {
  it('should return error 403 if ticket is not paid', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
      return mockEnrollment;
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
      return mockTicket;
    });

    const booking = bookingService.postBooking(1, 1);

    expect(booking).rejects.toEqual({
      name: 'AboveCapacityError',
      message: 'ticket not paid, does not include hotel or remote reservation',
    });
  });

  it('should return error 403 if ticket is not include hotel', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
      return mockEnrollment;
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
      return mockTicket2;
    });

    const booking = bookingService.postBooking(1, 1);

    expect(booking).rejects.toEqual({
      name: 'AboveCapacityError',
      message: 'ticket not paid, does not include hotel or remote reservation',
    });
  });
});
