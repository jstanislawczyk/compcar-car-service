import {Addon} from '../../../src/models/entities/addon';
import {addon, fullAddon} from '../../fixtures/addon.fixture';

export class AddonFixtureProvider {

  public static getValidAddon(populateOptionalFields: boolean = false): Addon {
    const validAddon: Addon = populateOptionalFields ? fullAddon : addon;

    return Object.assign({}, validAddon);
  }
}
