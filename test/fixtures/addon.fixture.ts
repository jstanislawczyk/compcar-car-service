import {Addon} from '../../src/models/entities/addon';

export const addon: Addon = {
  name: 'Air conditioner',
  description: 'Some test addon',
};

export const fullAddon: Addon = {
  ...addon,
  id: 1,
};
