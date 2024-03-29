import {Builder} from './builder';
import {RegistrationConfirmation} from '../../../src/models/entities/registration-confirmation';
import {RegistrationConfirmationFixtureProvider} from '../fixture-providers/registration-confirmation.fixture-provider';

export class RegistrationConfirmationBuilder extends Builder<RegistrationConfirmation> {

  constructor(populateOptionalFields: boolean = false) {
    const registrationConfirmation: RegistrationConfirmation =
      RegistrationConfirmationFixtureProvider.getValidRegistrationConfirmation(populateOptionalFields);

    super(registrationConfirmation);
  }

  public withId(id: number): RegistrationConfirmationBuilder {
    this.entity.id = id;
    return this;
  }

  public withAllowedConfirmationDate(allowedConfirmationDate: string): RegistrationConfirmationBuilder {
    this.entity.allowedConfirmationDate = allowedConfirmationDate;
    return this;
  }
}
