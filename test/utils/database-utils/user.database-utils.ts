import {getRepository, MoreThan, Repository} from 'typeorm';
import {User} from '../../../src/models/entities/user';

export class UserDatabaseUtils {

  public static getAllUsers(): Promise<User[]> {
    return this.getUserRepository().find();
  }

  public static getUserById(id: number): Promise<User | undefined> {
    return this.getUserRepository().findOne({ id });
  }

  public static getUserByIdOrFail(id: number): Promise<User> {
    return this.getUserRepository().findOneOrFail({ id });
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
