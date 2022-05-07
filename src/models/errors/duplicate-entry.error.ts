import {ApolloError} from 'apollo-server';
import {ErrorUtils} from '../../common/error.utils';

export class DuplicateEntryError extends ApolloError {

  constructor(message: string) {
    super(ErrorUtils.sanitizeDuplicatedIndexErrorMessage(message), 'DUPLICATED_ENTRY');

    Object.defineProperty(this, 'name', {
      value: 'DuplicatedEntryError',
    });
  }
}
