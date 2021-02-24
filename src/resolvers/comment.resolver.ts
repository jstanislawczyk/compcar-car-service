import {Resolver, Arg, Mutation, Query} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {Comment} from '../entities/comment';
import {CreateCommentInput} from '../inputs/comments/create-comment.input';
import {UserCommentFacade} from '../facades/user-comment.facade';
import {CommentMapper} from '../mapper/comment.mapper';

@Service()
@Resolver(() => Comment)
export class CommentResolver {

  constructor(
    private readonly userCommentFacade: UserCommentFacade,
    private readonly userMapper: CommentMapper,
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
    @Arg('createCommentInput') createCommentInput: CreateCommentInput,
  ): Promise<Comment> {
    Logger.log(`Saving comment for user with id=${userId}`);

    const comment: Comment = this.userMapper.toEntity(createCommentInput);

    return await this.userCommentFacade.saveUserComment(userId, comment);
  }

}
