import {Photo} from '../../src/models/entities/photo';

export const photo: Photo = {
  url: 'test url',
};

export const fullPhoto: Photo = {
  ...photo,
  id: 1,
  description: 'Test photo',
};
