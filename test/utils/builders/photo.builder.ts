import {Builder} from './builder';
import {Photo} from '../../../src/models/entities/photo';
import {PhotoFixtureProvider} from '../fixture-providers/photo.fixture-provider';

export class PhotoBuilder extends Builder<Photo> {

  constructor(populateOptionalFields: boolean = false) {
    const photo: Photo = PhotoFixtureProvider.getValidPhoto(populateOptionalFields);

    super(photo);
  }

  public withId(id: number): PhotoBuilder {
    this.entity.id = id;
    return this;
  }

  public withUrl(url: string): PhotoBuilder {
    this.entity.url = url;
    return this;
  }

  public withDescription(description: string): PhotoBuilder {
    this.entity.description = description;
    return this;
  }
}
