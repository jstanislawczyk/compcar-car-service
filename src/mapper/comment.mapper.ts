import {Service} from 'typedi';
import {CreateCommentInput} from '../models/inputs/comments/create-comment.input';
import {Comment} from '../models/entities/comment';

@Service()
export class CommentMapper {

  public toEntity(createCommentInput: CreateCommentInput): Comment {
    return {
      text: createCommentInput.text,
      rating: createCommentInput.rating,
      commentDate: new Date().toISOString(),
    };
  }
}
