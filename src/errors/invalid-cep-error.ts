import { ApplicationError } from '@/protocols';

export function invalidErrorCep(): ApplicationError {
  return {
    name: 'InvalidErrorCep',
    message: 'Cep does not exists',
  };
}
