import {Service} from 'typedi';
import {UserRepository} from '../repositories/user.repository';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {UserRole} from '../enums/user-role';
import {AuthenticationError} from 'apollo-server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import {User} from '../models/entities/user';
import {NotFoundError} from '../models/errors/not-found.error';
import {JwtToken} from '../models/common/jwt-token';
import {classToPlain} from 'class-transformer';

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
    const saltRounds: number = 10;
    const existingUser: User | undefined = await this.userRepository.findOne({
      select: ['id'],
      where: {
        email: user.email,
      },
    });

    if (existingUser !== undefined) {
      throw new NotFoundError(`User with email "${user.email}" already exist`);
    }

    user.password = bcrypt.hashSync(user.password, saltRounds);
    user.role = await this.getUserRole();

    return this.userRepository.save(user);
  }

  private async getUserRole(): Promise<UserRole> {
    const isFirstUserCreatedInDatabase: boolean = await this.userRepository.findOne() === undefined;

    return isFirstUserCreatedInDatabase
      ? UserRole.ADMIN
      : UserRole.USER;
  }
}
