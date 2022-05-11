import {Builder} from './builder';
import {Addon} from '../../../src/models/entities/addon';
import {AddonFixtureProvider} from '../fixture-providers/addon.fixture-provider';

export class AddonBuilder extends Builder<Addon> {

  constructor(populateOptionalFields: boolean = false) {
    const addon: Addon = AddonFixtureProvider.getValidAddon(populateOptionalFields);

    super(addon);
  }

  public withId(id: number): AddonBuilder {
    this.entity.id = id;
    return this;
  }

  public withName(name: string): AddonBuilder {
    this.entity.name = name;
    return this;
  }

  public withDescription(description: string): AddonBuilder {
    this.entity.description = description;
    return this;
  }
}
