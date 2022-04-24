import {Engine} from '../../src/models/entities/engine';
import {FuelType} from '../../src/models/enums/fuel-type';

export const engine: Engine = {
  name: '1.9TestNGN',
  acceleration: 6.5,
  averageFuelConsumption: 7.9,
  fuelCapacity: 1600,
  fuelType: FuelType.PETROL,
  horsePower: 125,
  inventedYear: '2000',
};

export const fullEngine: Engine = {
  ...engine,
  id: 1,
};
