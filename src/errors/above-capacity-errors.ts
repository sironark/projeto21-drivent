import { ApplicationError } from '@/protocols';

export function aboveCapacity(message: string): ApplicationError {
  return {
    name: 'AboveCapacityError',
    message,
  };
}
