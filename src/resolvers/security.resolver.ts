import {Resolver, Arg, Mutation, Query} from 'type-graphql';
import {Service} from 'typedi';
import {UserService} from '../services/user.service';
import {RegisterInput} from '../inputs/user/register.input';
import {Logger} from '../common/logger';
import {LoginInput} from '../inputs/user/login.input';
import {UserMapper} from '../mapper/user.mapper';
import {User} from '../models/entities/user';

@Service()
@Resolver(() => User)
export class SecurityResolver {

  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {
  }

  @Query(() => String)
  public async login(@Arg('loginInput') loginInput: LoginInput): Promise<string> {
    Logger.log(`Login user with email=${loginInput.email}`);

    return await this.userService.getUserToken(loginInput.email, loginInput.password);
  }

  @Mutation(() => User)
  public async register(@Arg('registerInput') registerInput: RegisterInput): Promise<User> {
    Logger.log('Register user');

    const user: User = this.userMapper.toRegisterUser(registerInput);

    return await this.userService.saveUser(user);
  }

}
