import {ApolloError} from 'apollo-server';

export class InvalidTokenError extends ApolloError {

  constructor(message: string) {
    super(message, 'INVALID_TOKEN');

    Object.defineProperty(this, 'name', {
      value: 'InvalidTokenError',
    });
  }
}
