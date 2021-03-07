import {Comment} from '../../src/models/entities/comment';

export const comment: Comment = {
  commentDate: new Date().toISOString(),
  rating: 3,
  text: 'Comment text',
};

export const fullComment: Comment = {
  ...comment,
  id: 1,
};
