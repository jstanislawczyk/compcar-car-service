import {ApolloError} from 'apollo-server';

export class OutdatedError extends ApolloError {

  constructor(message: string) {
    super(message, 'OUTDATED');

    Object.defineProperty(this, 'name', {
      value: 'OutdatedError',
    });
  }
}
