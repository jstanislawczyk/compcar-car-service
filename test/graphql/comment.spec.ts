import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {expect} from 'chai';
import {CommentDatabaseUtils} from '../utils/database-utils/comment.database-utils';
import {Comment} from '../../src/models/entities/comment';
import {CommentBuilder} from '../utils/builders/comment.builder';
import {DateUtils} from '../utils/common/date.utils';
import {ResponseError} from '../utils/interfaces/response-error';
import {CreateCommentInput} from '../../src/models/inputs/comments/create-comment.input';
import {TestValidationError} from '../utils/interfaces/validation-error';
import {User} from '../../src/models/entities/user';
import {UserBuilder} from '../utils/builders/user.builder';
import {UserDatabaseUtils} from '../utils/database-utils/user.database-utils';
import {CommonDatabaseUtils} from '../utils/database-utils/common.database-utils';

describe('Comment', () => {

  before(async () => {
    await CommonDatabaseUtils.deleteAllEntities();
  });

  beforeEach(async () => {
    await CommentDatabaseUtils.deleteAllComments();
    await UserDatabaseUtils.deleteAllUsers();
  });

  describe('getComments', () => {
    it('should get comments', async () => {
      // Arrange
      const commentsList: Comment[] = [
        new CommentBuilder().build(),
        new CommentBuilder()
          .withText('Test comment')
          .withRating(1)
          .build(),
      ];
      const query: string = `
        {
          getComments {
            id,
            text,
            rating,
            commentDate,
          }
        }
      `;

      await CommentDatabaseUtils.saveCommentsList(commentsList);

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const returnedComments: Comment[] = response.body.data.getComments as Comment[];
      expect(returnedComments).to.have.length(2);

      expect(Number(returnedComments[0].id)).to.be.be.above(0);
      expect(DateUtils.isISODate(returnedComments[0].commentDate)).to.be.be.true;
      expect(returnedComments[0].text).to.be.be.eql('Comment text');
      expect(returnedComments[0].rating).to.be.be.eql(3);
      expect(returnedComments[0].user).to.be.be.undefined;
      expect(Number(returnedComments[1].id)).to.be.be.above(0);
      expect(DateUtils.isISODate(returnedComments[1].commentDate)).to.be.be.true;
      expect(returnedComments[1].text).to.be.be.eql('Test comment');
      expect(returnedComments[1].rating).to.be.be.eql(1);
      expect(returnedComments[1].user).to.be.be.undefined;

      const existingComments: Comment[] = await CommentDatabaseUtils.getAllComments();
      expect(existingComments).to.have.length(2);

      expect(returnedComments[0].id).to.be.be.eql(existingComments[0].id?.toString());
      expect(returnedComments[0].user).to.be.be.eql(existingComments[0].user);
      expect(returnedComments[0].text).to.be.be.eql(existingComments[0].text);
      expect(returnedComments[0].rating).to.be.be.eql(existingComments[0].rating);
      expect(returnedComments[0].commentDate).to.be.be.eql(existingComments[0].commentDate);
      expect(returnedComments[0].user).to.be.be.eql(existingComments[0].user);
      expect(returnedComments[1].id).to.be.be.eql(existingComments[1].id?.toString());
      expect(returnedComments[1].user).to.be.be.eql(existingComments[1].user);
      expect(returnedComments[1].text).to.be.be.eql(existingComments[1].text);
      expect(returnedComments[1].rating).to.be.be.eql(existingComments[1].rating);
      expect(returnedComments[1].commentDate).to.be.be.eql(existingComments[1].commentDate);
      expect(returnedComments[1].user).to.be.be.eql(existingComments[1].user);
    });
  });

  describe('createComment', () => {
    it('should fail validation', async () => {
      // Arrange
      const createCommentInput: CreateCommentInput = {
        text: 'T',
        rating: 10,
      } as CreateCommentInput;

      const query: string = `
        mutation {
          createComment (
            userId: 1,
            createCommentInput: {
              text: "${createCommentInput.text}",
              rating: ${createCommentInput.rating},
            }
          ) {
            id,
            text,
            rating,
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const errorsBody: ResponseError = response.body.errors[0];
      expect(errorsBody.message).to.be.eql('Argument Validation Error');

      const errors: TestValidationError[] = errorsBody.extensions.exception.validationErrors;
      expect(errors).to.have.lengthOf(2);

      expect(errors[0].property).to.be.eql('text');
      expect(errors[0].value).to.be.eql('T');
      expect(errors[0].constraints.minLength).to.be.eql('text must be longer than or equal to 3 characters');
      expect(errors[1].property).to.be.eql('rating');
      expect(errors[1].value).to.be.eql(10);
      expect(errors[1].constraints.max).to.be.eql('rating must not be greater than 5');
    });

    it('should save comment', async () => {
      // Arrange
      const createCommentInput: CreateCommentInput = {
        text: 'Comment text',
        rating: 3,
      } as CreateCommentInput;
      const user: User = new UserBuilder()
        .withEmail('test@mail.com')
        .build();
      const existingUser: User = await UserDatabaseUtils.saveUser(user);

      const query: string = `
        mutation {
          createComment (
            userId: ${existingUser.id},
            createCommentInput: {
              text: "${createCommentInput.text}",
              rating: ${createCommentInput.rating},
            }
          ) {
            id,
            text,
            rating,
            commentDate,
            user {
              id,
              email,
            },
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const savedCommentResponse: Comment = response.body.data.createComment as Comment;
      expect(Number(savedCommentResponse.id)).to.be.above(0);
      expect(savedCommentResponse.text).to.be.eql('Comment text');
      expect(savedCommentResponse.rating).to.be.eql(3);
      expect(DateUtils.isISODate(savedCommentResponse.commentDate)).to.be.true;
      expect(Number(savedCommentResponse.user?.id)).to.be.above(0);
      expect(savedCommentResponse.user?.email).to.be.eql('test@mail.com');

      const existingComment: Comment = await CommentDatabaseUtils.getCommentByIdOrFail(Number(savedCommentResponse.id));
      expect(savedCommentResponse.id).to.be.be.eql(existingComment.id?.toString());
      expect(savedCommentResponse.user?.id).to.be.be.eql(existingComment.userId?.toString());
      expect(savedCommentResponse.text).to.be.be.eql(existingComment.text);
      expect(savedCommentResponse.rating).to.be.be.eql(existingComment.rating);
      expect(savedCommentResponse.commentDate).to.be.be.eql(existingComment.commentDate);
    });
  });
});
