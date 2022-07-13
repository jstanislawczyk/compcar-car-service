import {Service} from 'typedi';
import {UserService} from '../services/user.service';
import {TokenService} from '../services/token.service';
import {LoginCredentials} from '../models/common/security/login-credentials';
import {User} from '../models/entities/user';
import {AuthenticationError} from 'apollo-server';
import {EmailService} from '../services/email.service';
import {Email} from '../models/common/messages/email';

@Service()
export class SecurityFacade {

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {
  }

  public async authorizeUser(loginCredentials: LoginCredentials): Promise<string> {
    try {
      const user: User = await this.userService.findOneByEmail(loginCredentials.email);

      return this.tokenService.getUserToken(loginCredentials, user);
    } catch (error) {
      throw new AuthenticationError('Authentication data are not valid');
    }
  }

  public async registerUser(user: User): Promise<User> {
    // const savedUser: User = await this.userService.saveUser(user);
    const email: Email = {
      message: 'Thank you for registering',
      subject: 'Email registration',
      receiverAddress: user.email,
    };
    await this.emailService.sendMail(email);

    return user;
  }
}
