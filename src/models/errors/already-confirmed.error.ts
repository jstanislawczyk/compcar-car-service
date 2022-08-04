import {ApolloError} from 'apollo-server';

export class AlreadyConfirmedError extends ApolloError {

  constructor(message: string) {
    super(message, 'ALREADY_CONFIRMED');

    Object.defineProperty(this, 'name', {
      value: 'AlreadyConfirmedError',
    });
  }
}
