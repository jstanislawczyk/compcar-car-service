import {Service} from 'typedi';
import {RegisterInput} from '../models/inputs/user/register.input';
import {User} from '../models/entities/user';
import {UserRole} from '../models/enums/user-role';

@Service()
export class UserMapper {

  public toRegisterUser(registerInput: RegisterInput): User {
    return {
      email: registerInput.email,
      password: registerInput.password,
      registerDate: new Date().toISOString(),
      role: UserRole.USER,
      activated: true,
    };
  }
}
