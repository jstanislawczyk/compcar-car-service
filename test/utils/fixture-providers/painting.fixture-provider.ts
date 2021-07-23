import {Painting} from '../../../src/models/entities/painting';
import {fullPainting, painting} from '../../fixtures/painting.fixture';

export class PaintingFixtureProvider {

  public static getValidPainting(populateOptionalFields: boolean = false): Painting {
    const validPainting: Painting = populateOptionalFields ? fullPainting : painting;

    return Object.assign({}, validPainting);
  }
}
