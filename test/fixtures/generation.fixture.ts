import {Generation} from '../../src/models/entities/generation';

export const generation: Generation = {
  name: 'B6',
  description: 'Test description',
};

export const fullGeneration: Generation = {
  ...generation,
  id: 1,
};
