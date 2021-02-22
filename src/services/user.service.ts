import {Service} from 'typedi';
import {UserRepository} from '../repositories/user.repository';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {User} from '../entities/user';

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

  public saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
