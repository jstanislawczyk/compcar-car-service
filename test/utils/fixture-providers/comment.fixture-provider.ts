import {Comment} from '../../../src/models/entities/comment';
import {comment, fullComment} from '../../fixtures/comment.fixture';

export class CommentFixtureProvider {

  public static getValidComment(populateOptionalFields: boolean = false): Comment {
    const validComment: Comment = populateOptionalFields ? fullComment : comment;

    return Object.assign({}, validComment);
  }
}
