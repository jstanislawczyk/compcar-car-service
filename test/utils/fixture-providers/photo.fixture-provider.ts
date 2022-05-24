import {Photo} from '../../../src/models/entities/photo';
import {photo, fullPhoto} from '../../fixtures/photo.fixture';

export class PhotoFixtureProvider {

  public static getValidPhoto(populateOptionalFields: boolean = false): Photo {
    const validPhoto: Photo = populateOptionalFields ? fullPhoto : photo;

    return Object.assign({}, validPhoto);
  }
}
