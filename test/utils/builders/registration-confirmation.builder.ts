import {Builder} from './builder';
import {RegistrationConfirmation} from '../../../src/models/entities/registration-confirmation';
import {RegistrationConfirmationFixtureProvider} from '../fixture-providers/registration-confirmation.fixture-provider';
import {User} from '../../../src/models/entities/user';

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

  public withConfirmedAt(confirmedAt: string): RegistrationConfirmationBuilder {
    this.entity.confirmedAt = confirmedAt;
    return this;
  }

  public withCode(code: string): RegistrationConfirmationBuilder {
    this.entity.code = code;
    return this;
  }

  public withUser(user: User): RegistrationConfirmationBuilder {
    this.entity.user = user;
    return this;
  }
}
