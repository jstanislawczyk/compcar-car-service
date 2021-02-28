import {Resolver, Query} from 'type-graphql';
import {Service} from 'typedi';
import {UserService} from '../services/user.service';
import {Logger} from '../common/logger';
import {User} from '../models/entities/user';

@Service()
@Resolver(() => User)
export class UserResolver {

  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Query(() => [User])
  public getUsers(): Promise<User[]> {
    Logger.log('Fetching all users');

    return this.userService.findAll();
  }

}
