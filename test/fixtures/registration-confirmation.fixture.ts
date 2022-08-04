import {RegistrationConfirmation} from '../../src/models/entities/registration-confirmation';
import {v4} from 'uuid';
import {user} from './user.fixture';

export const registrationConfirmation: RegistrationConfirmation = {
  allowedConfirmationDate: new Date().toISOString(),
  code: v4(),
  user,
};

export const fullRegistrationConfirmation: RegistrationConfirmation = {
  ...registrationConfirmation,
  id: 1,
  confirmedAt: new Date(Date.now() + 10000).toISOString(),
};
