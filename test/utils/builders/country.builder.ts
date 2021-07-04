import {Builder} from './builder';
import {Country} from '../../../src/models/entities/country';
import {CountryFixtureProvider} from '../fixture-providers/country.fixture-provider';

export class CountryBuilder extends Builder<Country> {

  constructor(populateOptionalFields: boolean = false) {
    const country: Country = CountryFixtureProvider.getValidCountry(populateOptionalFields);

    super(country);
  }

  public withId(id: number): CountryBuilder {
    this.entity.id = id;
    return this;
  }

  public withName(name: string): CountryBuilder {
    this.entity.name = name;
    return this;
  }

  public withFlagPhotoUrl(flagPhotoUrl: string): CountryBuilder {
    this.entity.flagPhotoUrl = flagPhotoUrl;
    return this;
  }
}
