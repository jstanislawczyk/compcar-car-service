import {Service} from 'typedi';
import {UserService} from '../services/user.service';
import {TokenService} from '../services/token.service';
import {LoginCredentials} from '../models/common/security/login-credentials';
import {User} from '../models/entities/user';
import {AuthenticationError} from 'apollo-server';

@Service()
export class SecurityFacade {

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {
  }

  public async authorizeUser(loginCredentials: LoginCredentials): Promise<string> {
    try {
      const user: User = await this.userService.findOneByEmail(loginCredentials.email);

      return await this.tokenService.getUserToken(loginCredentials, user);
    } catch (error) {
      throw new AuthenticationError('Authentication data are not valid');
    }
  }

  public registerUser(user: User): Promise<User> {
    return this.userService.saveUser(user);
  }
}
