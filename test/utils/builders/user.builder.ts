import {Builder} from './builder';
import {User} from '../../../src/models/entities/user';
import {UserFixtureProvider} from '../fixture-providers/user.fixture-provider';
import {UserRole} from '../../../src/models/enums/user-role';
import {RegistrationConfirmation} from '../../../src/models/entities/registration-confirmation';

export class UserBuilder extends Builder<User> {

  constructor(populateOptionalFields: boolean = false) {
    const user: User = UserFixtureProvider.getValidUser(populateOptionalFields);

    super(user);
  }

  public withId(id: number): UserBuilder {
    this.entity.id = id;
    return this;
  }

  public withEmail(email: string): UserBuilder {
    this.entity.email = email;
    return this;
  }

  public withPassword(password: string): UserBuilder {
    this.entity.password = password;
    return this;
  }

  public withRegisterDate(registerDate: string): UserBuilder {
    this.entity.registerDate = registerDate;
    return this;
  }

  public withRole(role: UserRole): UserBuilder {
    this.entity.role = role;
    return this;
  }

  public withActivated(activated: boolean): UserBuilder {
    this.entity.activated = activated;
    return this;
  }

  public withRegistrationConfirmation(registrationConfirmation: RegistrationConfirmation): UserBuilder {
    this.entity.registrationConfirmation = registrationConfirmation;
    return this;
  }
}
