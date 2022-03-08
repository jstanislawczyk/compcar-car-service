import {Generation} from '../../src/models/entities/generation';

export const generation: Generation = {
  name: 'B6',
  startYear: '2002',
  description: 'Test description',
};

export const fullGeneration: Generation = {
  ...generation,
  id: 1,
  endYear: '2006',
};
