import {RegistrationConfirmation} from "../models/entities/registration-confirmation";
import {v4} from 'uuid';

export const registrationConfirmation: RegistrationConfirmation = {
  allowedConfirmationDate: new Date().toISOString(),
  code: v4(),
};

export const fullRegistrationConfirmation: RegistrationConfirmation = {
  ...registrationConfirmation,
  id: 1,
};
