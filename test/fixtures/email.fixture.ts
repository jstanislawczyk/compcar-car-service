import {Email} from '../../src/models/common/email/email';
import {v4} from 'uuid';

export const email: Email = {
  html: '<p>test</p>',
  text: 'test',
  subject: 'Test subject',
  receiverAddress: `${v4()}@mail.com`,
};
