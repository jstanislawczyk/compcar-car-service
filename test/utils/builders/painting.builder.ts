import {Builder} from './builder';
import {Painting} from '../../../src/models/entities/painting';
import {PaintingFixtureProvider} from '../fixture-providers/painting.fixture-provider';

export class PaintingBuilder extends Builder<Painting> {

  constructor(populateOptionalFields: boolean = false) {
    const painting: Painting = PaintingFixtureProvider.getValidPainting(populateOptionalFields);

    super(painting);
  }

  public withId(id: number): PaintingBuilder {
    this.entity.id = id;
    return this;
  }

  public withPrice(price: number): PaintingBuilder {
    this.entity.price = price;
    return this;
  }

}
