import {getRepository, MoreThan, Repository} from 'typeorm';
import {Comment} from '../../../src/models/entities/comment';
import {FindOneOptions} from 'typeorm/find-options/FindOneOptions';

export class CommentDatabaseUtils {

  public static getAllComments(): Promise<Comment[]> {
    return this.getCommentRepository().find();
  }

  public static getCommentById(id: number, options: FindOneOptions<Comment> = {}): Promise<Comment | undefined> {
    return this.getCommentRepository().findOne({ id }, options);
  }

  public static getCommentByIdOrFail(id: number, options: FindOneOptions<Comment> = {}): Promise<Comment> {
    return this.getCommentRepository().findOneOrFail({ id }, options);
  }

  public static saveComment(comment: Comment): Promise<Comment> {
    return this.getCommentRepository().save(comment);
  }

  public static saveCommentsList(comments: Comment[]): Promise<Comment[]> {
    return this.getCommentRepository().save(comments);
  }

  public static async deleteAllComments(): Promise<void> {
    const numberOfComments: number = await this.countComments();

    if (numberOfComments > 0) {
      await this.getCommentRepository().delete({
        id: MoreThan(0),
      });
    }
  }

  public static async countComments(): Promise<number> {
    return this.getCommentRepository().count();
  }

  private static getCommentRepository(): Repository<Comment> {
    return getRepository(Comment);
  }
}
