import {UserDatabaseUtils} from './user.database-utils';
import {CommentDatabaseUtils} from './comment.database-utils';

export class CommonDatabaseUtils {

  public static async deleteAllEntities(): Promise<void> {
    await CommentDatabaseUtils.deleteAllComments();
    await UserDatabaseUtils.deleteAllUsers();
  }
}
