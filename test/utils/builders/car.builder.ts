import {Builder} from './builder';
import {Car} from '../../../src/models/entities/car';
import {CarFixtureProvider} from '../fixture-providers/car.fixture-provider';
import {BodyStyle} from '../../../src/models/enums/body-style';

export class CarBuilder extends Builder<Car> {

  constructor(populateOptionalFields: boolean = false) {
    const car: Car = CarFixtureProvider.getValidCar(populateOptionalFields);

    super(car);
  }

  public withId(id: number): CarBuilder {
    this.entity.id = id;
    return this;
  }

  public withName(name: string): CarBuilder {
    this.entity.name = name;
    return this;
  }

  public withDescription(description: string): CarBuilder {
    this.entity.description = description;
    return this;
  }

  public withEndYear(endYear: string): CarBuilder {
    this.entity.endYear = endYear;
    return this;
  }

  public withStartYear(startYear: string): CarBuilder {
    this.entity.startYear = startYear;
    return this;
  }

  public withBasePrice(basePrice: number): CarBuilder {
    this.entity.basePrice = basePrice;
    return this;
  }

  public withWeight(weight: number): CarBuilder {
    this.entity.weight = weight;
    return this;
  }

  public withBodyStyle(bodyStyle: BodyStyle): CarBuilder {
    this.entity.bodyStyle = bodyStyle;
    return this;
  }
}
