import {Resolver, Arg, Mutation, Query} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {CommentCreateInput} from '../models/inputs/comments/comment-create.input';
import {UserCommentFacade} from '../facades/user-comment.facade';
import {CommentMapper} from '../mapper/comment.mapper';
import {Comment} from '../models/entities/comment';

@Service()
@Resolver(() => Comment)
export class CommentResolver {

  constructor(
    private readonly userCommentFacade: UserCommentFacade,
    private readonly commentMapper: CommentMapper,
  ) {
  }

  @Query(() => [Comment])
  public async getComments(): Promise<Comment[]> {
    Logger.log('Fetching all comments');

    return await this.userCommentFacade.findAll();
  }

  @Mutation(() => Comment)
  public async createComment(
    @Arg('userId') userId: number,
    @Arg('commentCreateInput') commentCreateInput: CommentCreateInput,
  ): Promise<Comment> {
    Logger.log(`Saving comment for user with id=${userId}`);

    const comment: Comment = this.commentMapper.toEntity(commentCreateInput);

    return await this.userCommentFacade.saveUserComment(userId, comment);
  }

}
