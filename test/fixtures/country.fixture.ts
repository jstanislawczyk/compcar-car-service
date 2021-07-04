import {Country} from '../../src/models/entities/country';

export const country: Country = {
  name: 'Poland',
  flagPhotoUrl: 'https://test.url.foo.bar/',
};

export const fullCountry: Country = {
  ...country,
  id: 1,
};
