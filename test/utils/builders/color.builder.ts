import {Builder} from './builder';
import {Color} from '../../../src/models/entities/color';
import {ColorFixtureProvider} from '../fixture-providers/color.fixture-provider';

export class ColorBuilder extends Builder<Color> {

  constructor(populateOptionalFields: boolean = false) {
    const color: Color = ColorFixtureProvider.getValidColor(populateOptionalFields);

    super(color);
  }

  public withId(id: number): ColorBuilder {
    this.entity.id = id;
    return this;
  }

  public withName(name: string): ColorBuilder {
    this.entity.name = name;
    return this;
  }

  public withHexCode(hexCode: string): ColorBuilder {
    this.entity.hexCode = hexCode;
    return this;
  }
}
