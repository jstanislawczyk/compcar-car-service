import {Service} from 'typedi';
import {Comment} from '../entities/comment';
import {CommentService} from '../services/comment.service';
import {UserService} from '../services/user.service';

@Service()
export class UserCommentFacade {

  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
  ) {
  }

  public findAll(): Promise<Comment[]> {
    return this.commentService.findAll();
  }

  public async saveUserComment(userId: number, comment: Comment): Promise<Comment> {
    comment.user = await this.userService.findOne(userId);

    return this.commentService.saveComment(comment);
  }
}
