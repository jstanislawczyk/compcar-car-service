import {EntityRepository, Repository} from 'typeorm';
import {User} from '../models/entities/user';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

}
