import {Service} from 'typedi';
import {UserService} from '../services/user.service';
import {TokenService} from '../services/token.service';
import {LoginCredentials} from '../models/common/security/login-credentials';
import {User} from '../models/entities/user';
import {AuthenticationError} from 'apollo-server';
import {EmailService} from '../services/email.service';
import {RegistrationConfirmationEmail} from '../models/common/email/registration-confirmation.email';
import {InactiveAccountError} from '../models/errors/inactive-account.error';
import {RegistrationConfirmation} from '../models/entities/registration-confirmation';

@Service()
export class SecurityFacade {

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {
  }

  public async authorizeUser(loginCredentials: LoginCredentials): Promise<string> {
    const user: User | undefined = await this.userService.findOneByEmail(loginCredentials.email);

    if (user === undefined) {
      throw new AuthenticationError('Credentials are incorrect');
    }

    if (!user.activated) {
      throw new InactiveAccountError('User account is inactive. Please confirm email');
    }

    return this.tokenService.getUserToken(loginCredentials, user);
  }

  public async registerUser(user: User): Promise<User> {
    const savedUser: User = await this.userService.saveUser(user);
    const registrationConfirmation: RegistrationConfirmation =
      await this.userService.createUserRegistrationConfirmation(savedUser);
    const registrationEmail: RegistrationConfirmationEmail = new RegistrationConfirmationEmail(
      savedUser, registrationConfirmation,
    );

    await this.emailService.sendMail(registrationEmail);

    return savedUser;
  }

  public activateUser(confirmationCode: string): Promise<RegistrationConfirmation> {
    return this.userService.activateUser(confirmationCode);
  }
}
