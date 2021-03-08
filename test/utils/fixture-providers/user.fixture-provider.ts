import {User} from '../../../src/models/entities/user';
import {fullUser, user} from '../../fixtures/user.fixture';

export class UserFixtureProvider {

  public static getValidUser(populateOptionalFields: boolean = false): User {
    const validUser: User = populateOptionalFields ? fullUser : user;

    return Object.assign({}, validUser);
  }
}
