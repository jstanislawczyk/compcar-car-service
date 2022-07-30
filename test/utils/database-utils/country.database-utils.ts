import {getRepository, MoreThan, Repository} from 'typeorm';
import {Country} from '../../../src/models/entities/country';
import {FindOneOptions} from 'typeorm/find-options/FindOneOptions';

export class CountryDatabaseUtils {

  public static getAllCountries(): Promise<Country[]> {
    return this.getCountryRepository().find();
  }

  public static getCountryById(id: number, options: FindOneOptions<Country> = {}): Promise<Country | undefined> {
    return this.getCountryRepository().findOne({ id }, options);
  }

  public static getCountryByIdOrFail(id: number, options: FindOneOptions<Country> = {}): Promise<Country> {
    return this.getCountryRepository().findOneOrFail({ id }, options);
  }

  public static saveCountry(country: Country): Promise<Country> {
    return this.getCountryRepository().save(country);
  }

  public static saveCountriesList(countries: Country[]): Promise<Country[]> {
    return this.getCountryRepository().save(countries);
  }

  public static async deleteAllCountries(): Promise<void> {
    const numberOfCountries: number = await this.countCountries();

    if (numberOfCountries > 0) {
      await this.getCountryRepository().delete({
        id: MoreThan(0),
      });
    }
  }

  public static async countCountries(): Promise<number> {
    return this.getCountryRepository().count();
  }

  private static getCountryRepository(): Repository<Country> {
    return getRepository(Country);
  }
}
