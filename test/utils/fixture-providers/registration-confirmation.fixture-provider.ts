import {RegistrationConfirmation} from '../../../src/models/entities/registration-confirmation';
import {fullRegistrationConfirmation, registrationConfirmation} from '../../fixtures/registration-confirmation.fixture';

export class RegistrationConfirmationFixtureProvider {

  public static getValidRegistrationConfirmation(populateOptionalFields: boolean = false): RegistrationConfirmation {
    const validRegistrationConfirmation: RegistrationConfirmation = populateOptionalFields
      ? fullRegistrationConfirmation
      : registrationConfirmation;

    return Object.assign({}, validRegistrationConfirmation);
  }
}
