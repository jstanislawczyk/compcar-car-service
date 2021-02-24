import {Service} from 'typedi';
import {RegisterInput} from '../inputs/user/register.input';
import {User} from '../entities/user';
import {UserRole} from '../enums/user-role';

@Service()
export class UserMapper {

  public toRegisterUser(registerInput: RegisterInput): User {
    return {
      email: registerInput.email,
      password: registerInput.password,
      registerDate: new Date(),
      role: UserRole.USER,
      activated: true,
    };
  }
}
