import {ApolloError} from 'apollo-server';

export class InactiveAccountError extends ApolloError {

  constructor(message: string) {
    super(message, 'INACTIVE_ACCOUNT');

    Object.defineProperty(this, 'name', {
      value: 'InactiveAccountError',
    });
  }
}
