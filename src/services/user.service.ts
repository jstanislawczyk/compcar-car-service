import {Service} from 'typedi';
import {UserRepository} from '../repositories/user.repository';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {User} from '../entities/user';
import bcrypt from 'bcrypt';
import {UserRole} from '../enums/user-role';
import {ApolloError} from 'apollo-server';

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

  public findOne(id: number): Promise<User> {
    return this.userRepository.findOneOrFail({
      id,
    });
  }

  public async saveUser(user: User): Promise<User> {
    const saltRounds: number = 10;
    const existingUser: User | undefined = await this.userRepository.findOne({
      select: ['id'],
      where: {
        email: user.email,
      },
    });

    if (existingUser !== undefined) {
      throw new ApolloError(`User with email=${user.email} already exist`, '409');
    }

    user.password = bcrypt.hashSync(user.password, saltRounds);
    user.role = await this.getUserRole();

    return this.userRepository.save(user);
  }

  public async loginUser(email: string, password: string): Promise<string> {
    const user: User = await this.userRepository.findOneOrFail({
      email,
    });

    return bcrypt.compareSync(password, user.password)
      ? 'authorized'
      : 'unauthorized';
  }

  private async getUserRole(): Promise<UserRole> {
    const isFirstUserCreated: boolean = await this.userRepository.findOne() === undefined;

    return isFirstUserCreated
      ? UserRole.ADMIN
      : UserRole.USER;
  }
}
