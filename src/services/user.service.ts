import {Service} from 'typedi';
import {UserRepository} from '../repositories/user.repository';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {User} from '../models/entities/user';
import {EntityAlreadyExistsError} from '../models/errors/entity-already-exists.error';
import bcrypt from 'bcryptjs';
import config from 'config';
import {UserRole} from '../models/enums/user-role';
import {RegistrationConfirmationRepository} from '../repositories/registration-confirmation.repository';
import {RegistrationConfirmation} from '../models/entities/registration-confirmation';
import {v4} from 'uuid';
import {DateUtils} from '../common/date.utils';
import {NotFoundError} from '../models/errors/not-found.error';
import {OutdatedError} from '../models/errors/outdated.error';

@Service()
export class UserService {

  constructor(
    @InjectRepository()
    private readonly userRepository: UserRepository,
    @InjectRepository()
    private readonly registrationConfirmationRepository: RegistrationConfirmationRepository,
  ) {
  }

  public findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public findOneById(id: number): Promise<User> {
    return this.userRepository.findOneOrFail({
      id,
    });
  }

  public findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      email,
    });
  }

  public async saveUser(user: User): Promise<User> {
    const existingUser: User | undefined = await this.userRepository.findOne({
      select: ['id'],
      where: {
        email: user.email,
      },
    });

    if (existingUser !== undefined) {
      throw new EntityAlreadyExistsError(`User with email "${user.email}" already exist`);
    }

    user = await this.setupUserData(user);

    return this.userRepository.save(user);
  }

  public createUserRegistrationConfirmation(user: User): Promise<RegistrationConfirmation> {
    const emailConfirmationTimeoutMillis = Number(config.get('security.emailConfirmationTimeoutMin')) * 60 * 1000;
    const registrationConfirmation: RegistrationConfirmation = new RegistrationConfirmation();
    registrationConfirmation.code = v4();
    registrationConfirmation.allowedConfirmationDate = DateUtils.addMillisToISODate(
      user.registerDate, emailConfirmationTimeoutMillis,
    );
    registrationConfirmation.user = user;

    return this.registrationConfirmationRepository.save(registrationConfirmation);
  }

  public async activateUser(confirmationCode: string): Promise<RegistrationConfirmation> {
    const registrationConfirmation: RegistrationConfirmation | undefined = await this.registrationConfirmationRepository
      .findOne({
        code: confirmationCode,
      });

    if (registrationConfirmation === undefined) {
      throw new NotFoundError('Unknown registration confirmation code');
    }

    if (new Date() > new Date(registrationConfirmation.allowedConfirmationDate)) {
      throw new OutdatedError('Unknown registration confirmation code');
    }

    registrationConfirmation.confirmedAt = new Date().toISOString();

    return registrationConfirmation;
  }

  private async setupUserData(user: User): Promise<User> {
    const saltRounds: number = config.get('security.bcrypt.rounds');
    user.password = bcrypt.hashSync(user.password, saltRounds);
    user.role = await this.getUserRole();

    return user;
  }

  private async getUserRole(): Promise<UserRole> {
    const anyUser: User | undefined = await this.userRepository.findOne({
      select: ['id'],
    });
    const isFirstUserCreatedInDatabase: boolean = anyUser === undefined;

    return isFirstUserCreatedInDatabase
      ? UserRole.ADMIN
      : UserRole.USER;
  }
}
