import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {CommentResolver} from './comment.resolver';
import {UserCommentFacade} from '../facades/user-comment.facade';
import {CommentMapper} from '../mapper/comment.mapper';
import {Comment} from '../models/entities/comment';
import {CreateCommentInput} from '../models/inputs/comments/create-comment.input';
import {CommentBuilder} from '../../test/utils/builders/comment.builder';

use(sinonChai);
use(chaiAsPromised);

context('CommentResolver', () => {

  let sandbox: SinonSandbox;
  let userCommentFacadeStub: SinonStubbedInstance<UserCommentFacade>;
  let commentMapperStub: SinonStubbedInstance<CommentMapper>;
  let commentResolver: CommentResolver;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    userCommentFacadeStub = sandbox.createStubInstance(UserCommentFacade);
    commentMapperStub = sandbox.createStubInstance(CommentMapper);

    commentResolver = new CommentResolver(userCommentFacadeStub, commentMapperStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getComments', () => {
    it('should return comments list', async () => {
      // Arrange
      const savedComments: Comment[] = [
        new CommentBuilder().build(),
        new CommentBuilder()
          .withRating(2)
          .withText('Second comment')
          .build(),
      ];
      userCommentFacadeStub.findAll.resolves(savedComments);

      // Act
      const comments: Comment[] = await commentResolver.getComments();

      // Assert
      expect(comments).to.have.length(2);
      expect(comments).to.be.eql(savedComments);
    });

    it('should throw error', async () => {
      // Arrange
      userCommentFacadeStub.findAll.rejects(new Error('FindAll error'));

      // Act
      const findAllCommentsResult: Promise<Comment[]> = commentResolver.getComments();

      // Assert
      await expect(findAllCommentsResult).to.eventually.be.rejectedWith('FindAll error');
    });
  });

  describe('createComment', () => {
    it('should create comment', async () => {
      // Arrange
      const userId: number = 1;
      const mappedComment: Comment = new CommentBuilder().build();
      const savedComment: Comment = new CommentBuilder(true).build();
      const createCommentInput: CreateCommentInput = {
        text: 'Comment text',
        rating: 2,
      };

      commentMapperStub.toEntity.returns(mappedComment);
      userCommentFacadeStub.saveUserComment.resolves(savedComment);

      // Act
      const returnedComment: Comment = await commentResolver.createComment(userId, createCommentInput);

      // Assert
      expect(returnedComment).to.be.eql(savedComment);
      expect(commentMapperStub.toEntity).to.be.calledOnceWith(createCommentInput);
      expect(userCommentFacadeStub.saveUserComment).to.be.calledOnceWith(userId, mappedComment);
    });

    it('should throw error if comment saving fails', async () => {
      // Arrange
      const userId: number = 1;
      const mappedComment: Comment = new CommentBuilder().build();
      const createCommentInput: CreateCommentInput = {
        text: 'Comment text',
        rating: 2,
      };

      commentMapperStub.toEntity.returns(mappedComment);
      userCommentFacadeStub.saveUserComment.rejects(new Error('SaveUserComment error'));

      // Act
      const returnedCommentResult: Promise<Comment> = commentResolver.createComment(userId, createCommentInput);

      // Assert
      await expect(returnedCommentResult).to.eventually.be.rejectedWith('SaveUserComment error');
    });
  });
});
