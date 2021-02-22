import {Resolver, Arg, Mutation, Query} from 'type-graphql';
import {Service} from 'typedi';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {RegisterUserInput} from '../inputs/user/register-user.input';
import {Logger} from '../common/logger';

@Service()
@Resolver(() => User)
export class BookResolver {

  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Query(() => [User])
  public async getUsers(): Promise<User[]> {
    Logger.log('Fetching all users');

    return await this.userService.findAll();
  }

  @Mutation(() => User)
  public async registerUser(@Arg('registerUserInput') registerUserInput: RegisterUserInput): Promise<User> {
    const user: User = {
      email: registerUserInput.email,
      password: registerUserInput.password,
      activated: true,
      registerDate: new Date(),
    };

    return await this.userService.saveUser(user);
  }

}
