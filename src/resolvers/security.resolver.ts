import {Resolver, Arg, Mutation, Query} from 'type-graphql';
import {Service} from 'typedi';
import {RegisterInput} from '../models/inputs/user/register.input';
import {Logger} from '../common/logger';
import {LoginInput} from '../models/inputs/user/login.input';
import {UserMapper} from '../mapper/user.mapper';
import {User} from '../models/entities/user';
import {SecurityFacade} from '../facades/security.facade';
import {LoginCredentials} from '../models/common/security/login-credentials';
import {LoginCredentialsMapper} from '../mapper/login-credentials.mapper';

@Service()
@Resolver(() => User)
export class SecurityResolver {

  constructor(
    private readonly securityFacade: SecurityFacade,
    private readonly loginCredentialsMapper: LoginCredentialsMapper,
    private readonly userMapper: UserMapper,
  ) {
  }

  @Query(() => String)
  public async login(@Arg('loginInput') loginInput: LoginInput): Promise<string> {
    Logger.log(`Login user with email=${loginInput.email}`);

    const loginCredentials: LoginCredentials = this.loginCredentialsMapper.toLoginCredentials(loginInput);

    return await this.securityFacade.authorizeUser(loginCredentials);
  }

  @Mutation(() => User)
  public async register(@Arg('registerInput') registerInput: RegisterInput): Promise<User> {
    Logger.log(`Register user with email=${registerInput.email}`);

    const user: User = this.userMapper.toRegisterUser(registerInput);

    return await this.securityFacade.registerUser(user);
  }

}
