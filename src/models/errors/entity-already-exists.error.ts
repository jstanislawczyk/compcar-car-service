import {ApolloError} from 'apollo-server';

export class EntityAlreadyExistsError extends ApolloError {

  constructor(message: string) {
    super(message, 'ENTITY_ALREADY_EXISTS');

    Object.defineProperty(this, 'name', {
      value: 'EntityAlreadyExistsError',
    });
  }
}
