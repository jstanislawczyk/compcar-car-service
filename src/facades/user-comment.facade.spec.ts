import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {UserService} from '../services/user.service';
import {UserCommentFacade} from './user-comment.facade';
import {CommentService} from '../services/comment.service';
import {Comment} from '../models/entities/comment';
import {CommentBuilder} from '../../test/utils/builders/comment.builder';
import {UserBuilder} from '../../test/utils/builders/user.builder';

use(sinonChai);
use(chaiAsPromised);

context('UserCommentFacade', () => {

  let sandbox: SinonSandbox;
  let userServiceStub: SinonStubbedInstance<UserService>;
  let commentServiceStub: SinonStubbedInstance<CommentService>;
  let userCommentFacade: UserCommentFacade;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    userServiceStub = sandbox.createStubInstance(UserService);
    commentServiceStub = sandbox.createStubInstance(CommentService);

    userCommentFacade = new UserCommentFacade(commentServiceStub, userServiceStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findAll', () => {
    it('should return comments list', async () => {
      // Arrange
      const returnedComments: Comment[] = [
        new CommentBuilder().build(),
        new CommentBuilder()
          .withId(1)
          .withText('Second Comment')
          .build(),
      ];

      commentServiceStub.findAll.resolves(returnedComments);

      // Act
      const comments: Comment[] = await userCommentFacade.findAll();

      // Assert
      expect(comments).to.have.length(2);
      expect(comments).to.be.eql(returnedComments);
    });

    it('should throw error', async () => {
      // Arrange
      commentServiceStub.findAll.rejects(new Error('FindAll error'));

      // Act
      const findAllCommentsResult: Promise<Comment[]> = userCommentFacade.findAll();

      // Assert
      await expect(findAllCommentsResult).to.eventually.be.rejectedWith('FindAll error');
    });
  });

  describe('saveUserComment', () => {
    it('should save comment', async () => {
      // Arrange
      const commentToSave: Comment = new CommentBuilder().build();
      const userId: number = 1;

      userServiceStub.findOneById.resolves(new UserBuilder().build());
      commentServiceStub.saveComment.resolves(new CommentBuilder(true).build());

      // Act
      const savedComment: Comment = await userCommentFacade.saveUserComment(userId, commentToSave);

      // Assert
      const expectedSavedComment: Comment = new CommentBuilder()
        .withUser(new UserBuilder().build())
        .build();
      expect(savedComment).to.be.eql(new CommentBuilder(true).build());
      expect(userServiceStub.findOneById).to.be.calledOnceWith(userId);
      expect(commentServiceStub.saveComment).to.be.calledOnceWith(expectedSavedComment);
    });

    it('should throw error if user is not found', async () => {
      // Arrange
      const userId: number = 1;

      userServiceStub.findOneById.rejects(new Error('FindOne error'));

      // Act
      const saveUserCommentResult: Promise<Comment> = userCommentFacade.saveUserComment(userId, new CommentBuilder().build());

      // Assert
      await expect(saveUserCommentResult).to.eventually.be.rejectedWith('FindOne error');
      expect(userServiceStub.findOneById).to.be.calledOnceWith(userId);
      expect(commentServiceStub.saveComment).to.be.not.called;
    });

    it('should throw error if comment saving fails', async () => {
      // Arrange
      userServiceStub.findOneById.resolves(new UserBuilder().build());
      commentServiceStub.saveComment.rejects(new Error('SaveComment error'));

      // Act
      const saveUserCommentResult: Promise<Comment> = userCommentFacade.saveUserComment(1, new CommentBuilder().build());

      // Assert
      await expect(saveUserCommentResult).to.eventually.be.rejectedWith('SaveComment error');
    });
  });
});
