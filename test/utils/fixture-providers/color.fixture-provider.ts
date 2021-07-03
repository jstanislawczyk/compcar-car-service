import {Color} from '../../../src/models/entities/color';
import {color, fullColor} from '../../fixtures/color.fixture';

export class ColorFixtureProvider {

  public static getValidColor(populateOptionalFields: boolean = false): Color {
    const validColor: Color = populateOptionalFields ? fullColor : color;

    return Object.assign({}, validColor);
  }
}
