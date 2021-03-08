import {Builder} from './builder';
import {Comment} from '../../../src/models/entities/comment';
import {CommentFixtureProvider} from '../fixture-providers/comment.fixture-provider';

export class CommentBuilder extends Builder<Comment> {

  constructor(populateOptionalFields: boolean = false) {
    const comment: Comment = CommentFixtureProvider.getValidComment(populateOptionalFields);

    super(comment);
  }

  public withId(id: number): CommentBuilder {
    this.entity.id = id;
    return this;
  }

  public withRating(rating: number): CommentBuilder {
    this.entity.rating = rating;
    return this;
  }

  public withText(text: string): CommentBuilder {
    this.entity.text = text;
    return this;
  }
}
