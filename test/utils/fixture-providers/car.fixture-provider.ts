import {Car} from '../../../src/models/entities/car';
import {fullCar, car} from '../../fixtures/car.fixture';

export class CarFixtureProvider {

  public static getValidCar(populateOptionalFields: boolean = false): Car {
    const validCar: Car = populateOptionalFields ? fullCar : car;

    return Object.assign({}, validCar);
  }
}
