import {Painting} from '../../src/models/entities/painting';

export const painting: Painting = {
  price: 123.45,
};

export const fullPainting: Painting = {
  ...painting,
  id: 1,
};
