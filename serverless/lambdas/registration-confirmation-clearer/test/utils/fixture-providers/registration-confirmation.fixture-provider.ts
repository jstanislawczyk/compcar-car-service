import {fullRegistrationConfirmation, registrationConfirmation} from '../../fixtures/registration-confirmation.fixture';
import {RegistrationConfirmation} from '../../models/entities/registration-confirmation';

export class RegistrationConfirmationFixtureProvider {

  public static getValidRegistrationConfirmation(populateOptionalFields: boolean = false): RegistrationConfirmation {
    const validRegistrationConfirmation: RegistrationConfirmation = populateOptionalFields
      ? fullRegistrationConfirmation
      : registrationConfirmation;

    return Object.assign({}, validRegistrationConfirmation);
  }
}
