import {Color} from '../../src/models/entities/color';

export const color: Color = {
  name: 'red',
  hexCode: '#F00',
};

export const fullColor: Color = {
  ...color,
  id: 1,
};
