import {ApolloError} from 'apollo-server';

export class EmailSendingFailureError extends ApolloError {

  constructor(message: string) {
    super(message, 'EMAIL_SENDING_FAILURE');

    Object.defineProperty(this, 'name', {
      value: 'EmailSendingFailureError',
    });
  }
}
