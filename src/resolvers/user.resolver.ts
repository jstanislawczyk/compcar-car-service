import {Resolver, Query, Authorized} from 'type-graphql';
import {Service} from 'typedi';
import {UserService} from '../services/user.service';
import {Logger} from '../common/logger';
import {User} from '../models/entities/user';
import {UserRole} from '../models/enums/user-role';

@Service()
@Resolver(() => User)
export class UserResolver {

  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Authorized(UserRole.ADMIN)
  @Query(() => [User])
  public async getUsers(): Promise<User[]> {
    Logger.log('Fetching all users');

    return await this.userService.findAll();
  }

}
