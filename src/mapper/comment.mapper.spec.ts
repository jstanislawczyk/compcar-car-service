import {expect} from 'chai';
import {Comment} from '../models/entities/comment';
import {CommentMapper} from './comment.mapper';
import {CommentCreateInput} from '../models/inputs/comments/comment-create.input';
import {DateUtils} from '../../test/utils/common/date.utils';

context('CommentMapper', () => {

  let commentMapper: CommentMapper;

  beforeEach(() => {
    commentMapper = new CommentMapper();
  });

  describe('toEntity', () => {
    it('should map to entity', () => {
      // Arrange
      const commentCreateInput: CommentCreateInput = {
        rating: 5,
        text: 'Test',
      };

      // Act
      const commentToSave: Comment = commentMapper.toEntity(commentCreateInput);

      // Assert
      expect(commentToSave.rating).to.be.eql(commentCreateInput.rating);
      expect(commentToSave.text).to.be.eql(commentCreateInput.text);
      expect(DateUtils.isISODate(commentToSave.commentDate)).to.be.true;
      expect(commentToSave.user).to.be.undefined;
      expect(commentToSave.id).to.be.undefined;
    });
  });
});
