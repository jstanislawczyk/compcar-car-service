import {Model} from '../../src/models/entities/model';
import {brand} from './brand.fixture';

export const model: Model = {
  brand,
  description: 'German limousine',
  name: 'A4',
};

export const fullModel: Model = {
  ...model,
  id: 1,
  generations: [],
};
