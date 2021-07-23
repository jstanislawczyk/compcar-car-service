import {Service} from 'typedi';
import {CommentCreateInput} from '../models/inputs/comments/comment-create.input';
import {Comment} from '../models/entities/comment';

@Service()
export class CommentMapper {

  public toEntity(commentCreateInput: CommentCreateInput): Comment {
    return {
      text: commentCreateInput.text,
      rating: commentCreateInput.rating,
      commentDate: new Date().toISOString(),
    };
  }
}
