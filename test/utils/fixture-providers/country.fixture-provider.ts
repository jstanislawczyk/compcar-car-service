import {Country} from '../../../src/models/entities/country';
import {country, fullCountry} from '../../fixtures/country.fixture';

export class CountryFixtureProvider {

  public static getValidCountry(populateOptionalFields: boolean = false): Country {
    const validCountry: Country = populateOptionalFields ? fullCountry : country;

    return Object.assign({}, validCountry);
  }
}
