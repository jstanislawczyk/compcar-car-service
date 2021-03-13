import {expect, use} from 'chai';
import {CommentRepository} from '../repositories/comment.repository';
import {CommentService} from './comment.service';
import {Comment} from '../models/entities/comment';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {CommentBuilder} from '../../test/utils/builders/comment.builder';

use(sinonChai);
use(chaiAsPromised);

context('CommentService', () => {

  let sandbox: SinonSandbox;
  let commentRepositoryStub: SinonStubbedInstance<CommentRepository>;
  let commentService: CommentService;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    commentRepositoryStub = sandbox.createStubInstance(CommentRepository);
    commentService = new CommentService(commentRepositoryStub as unknown as CommentRepository);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findAll', () => {
    it('should get users list', async () => {
      // Arrange
      const usersList: Comment[] = [
        new CommentBuilder(true).build(),
        new CommentBuilder(true)
            .withRating(2)
            .withText('Test comment')
            .build(),
      ];

      commentRepositoryStub.find.resolves(usersList);

      // Act
      const commentsResult: Comment[] = await commentService.findAll();

      // Assert
      expect(commentsResult).to.be.have.length(2);
      expect(commentsResult[0]).to.be.eql(usersList[0]);
      expect(commentsResult[1]).to.be.eql(usersList[1]);
      expect(commentRepositoryStub.find).to.be.calledOnce;
    });

    it('should throw error', async () => {
      // Arrange
      commentRepositoryStub.find.rejects(new Error('Find error'));

      // Act
      const commentsResult: Promise<Comment[]> = commentService.findAll();

      // Assert
      await expect(commentsResult).to.eventually.be.rejectedWith('Find error');
    });
  });

  describe('saveComment', () => {
    it('should save comment', async () => {
      // Arrange
      const commentToSave: Comment = new CommentBuilder().build();
      const savedComment: Comment = new CommentBuilder()
        .withId(1)
        .build();

      commentRepositoryStub.save.resolves(savedComment);

      // Act
      const saveCommentResult: Comment = await commentService.saveComment(commentToSave);

      // Assert
      expect(saveCommentResult).to.be.eql(savedComment);
      expect(commentRepositoryStub.save).to.be.calledOnceWith(commentToSave);
    });

    it('should throw error', async () => {
      // Arrange
      commentRepositoryStub.save.rejects(new Error('Save error'));

      // Act
      const saveCommentResult: Promise<Comment> = commentService.saveComment(new CommentBuilder().build());

      // Assert
      await expect(saveCommentResult).to.eventually.be.rejectedWith('Save error');
    });
  });
});
