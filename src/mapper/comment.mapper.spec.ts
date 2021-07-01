import {expect} from 'chai';
import {Comment} from '../models/entities/comment';
import {CommentMapper} from './comment.mapper';
import {CreateCommentInput} from '../models/inputs/comments/create-comment.input';
import {DateUtils} from '../../test/utils/common/date.utils';

context('CommentMapper', () => {

  let commentMapper: CommentMapper;

  beforeEach(() => {
    commentMapper = new CommentMapper();
  });

  describe('toEntity', () => {
    it('should map to entity', () => {
      // Arrange
      const createCommentInput: CreateCommentInput = {
        rating: 5,
        text: 'Test',
      };

      // Act
      const commentToSave: Comment = commentMapper.toEntity(createCommentInput);

      // Assert
      expect(commentToSave.rating).to.be.eql(createCommentInput.rating);
      expect(commentToSave.text).to.be.eql(createCommentInput.text);
      expect(DateUtils.isISODate(commentToSave.commentDate)).to.be.true;
      expect(commentToSave.user).to.be.undefined;
      expect(commentToSave.userId).to.be.undefined;
      expect(commentToSave.id).to.be.undefined;
    });
  });
});
