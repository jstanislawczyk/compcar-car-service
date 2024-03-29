import {getRepository, MoreThan, Repository} from 'typeorm';
import {User} from '../../../src/models/entities/user';
import {FindOneOptions} from 'typeorm/find-options/FindOneOptions';

export class UserDatabaseUtils {

  public static getAllUsers(): Promise<User[]> {
    return this.getUserRepository().find();
  }

  public static getUserById(id: number, options: FindOneOptions<User> = {}): Promise<User | undefined> {
    return this.getUserRepository().findOne({ id }, options);
  }

  public static getUserByIdOrFail(id: number, options: FindOneOptions<User> = {}): Promise<User> {
    return this.getUserRepository().findOneOrFail({ id }, options);
  }

  public static saveUser(user: User): Promise<User> {
    return this.getUserRepository().save(user);
  }

  public static saveUsersList(users: User[]): Promise<User[]> {
    return this.getUserRepository().save(users);
  }

  public static async deleteAllUsers(): Promise<void> {
    const numberOfUsers: number = await this.countUsers();

    if (numberOfUsers > 0) {
      await this.getUserRepository().delete({
        id: MoreThan(0),
      });
    }
  }

  public static async countUsers(): Promise<number> {
    return this.getUserRepository().count();
  }

  private static getUserRepository(): Repository<User> {
    return getRepository(User);
  }
}
