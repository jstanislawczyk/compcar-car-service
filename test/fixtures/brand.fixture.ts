import {Brand} from '../../src/models/entities/brand';
import {country} from './country.fixture';

export const brand: Brand = {
  logoPhotoUrl: 'https://test.logo.url.foo.bar/',
  name: 'Audi',
};

export const fullBrand: Brand = {
  ...brand,
  id: 1,
  country,
};
