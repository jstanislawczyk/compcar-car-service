import {Service} from 'typedi';
import {UserRepository} from '../repositories/user.repository';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {UserRole} from '../enums/user-role';
import {User} from '../models/entities/user';
import {EntityAlreadyExistsError} from '../models/errors/entity-already-exists.error';
import bcrypt from 'bcrypt';
import config from 'config';

@Service()
export class UserService {

  constructor(
    @InjectRepository()
    private readonly userRepository: UserRepository,
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

  public findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      email,
    });
  }

  public async saveUser(user: User): Promise<User> {
    const saltRounds: number = config.get('security.bcrypt.rounds');
    const existingUser: User | undefined = await this.userRepository.findOne({
      select: ['id'],
      where: {
        email: user.email,
      },
    });

    if (existingUser !== undefined) {
      throw new EntityAlreadyExistsError(`User with email "${user.email}" already exist`);
    }

    user.password = bcrypt.hashSync(user.password, saltRounds);
    user.role = await this.getUserRole();

    return this.userRepository.save(user);
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
