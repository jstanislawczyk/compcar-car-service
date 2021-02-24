import {Service} from 'typedi';
import {CreateCommentInput} from '../inputs/comments/create-comment.input';
import {Comment} from '../entities/comment';

@Service()
export class CommentMapper {

  public toEntity(createCommentInput: CreateCommentInput): Comment {
    return {
      text: createCommentInput.text,
      rating: createCommentInput.rating,
      commentDate: new Date(),
    };
  }
}
