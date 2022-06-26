import {Car} from '../../src/models/entities/car';
import {BodyStyle} from '../../src/models/enums/body-style';

export const car: Car = {
  name: 'B6',
  description: 'Test description',
  basePrice: 10000,
  startYear: 2010,
  weight: 1000,
  bodyStyle: BodyStyle.SEDAN,
};

export const fullCar: Car = {
  ...car,
  id: 1,
  endYear: 2015,
};
