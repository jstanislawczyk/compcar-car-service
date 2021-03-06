import {Service} from 'typedi';
import {LoginInput} from '../inputs/user/login.input';
import {LoginCredentials} from '../models/common/login-credentials';

@Service()
export class LoginCredentialsMapper {

  public toLoginCredentials(loginInput: LoginInput): LoginCredentials {
    return {
      email: loginInput.email,
      password: loginInput.password,
    };
  }
}
