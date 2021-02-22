import {Service} from 'typedi';
import {UserRepository} from '../repositories/user.repository';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {User} from '../models/user';

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

  public saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
