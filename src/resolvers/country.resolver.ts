import {Resolver, Arg, Mutation} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {CountryService} from '../services/country.service';
import {Country} from '../models/entities/country';
import {CountryMapper} from '../mapper/country.mapper';
import {CountryCreateInput} from '../models/inputs/country/country-create.input';

@Service()
@Resolver(() => Country)
export class CountryResolver {

  constructor(
    private readonly countryService: CountryService,
    private readonly countryMapper: CountryMapper,
  ) {
  }

  @Mutation(() => Country)
  public async createCountry(
    @Arg('countryCreateInput') countryCreateInput: CountryCreateInput,
  ): Promise<Country> {
    Logger.log(`Saving new country with name=${countryCreateInput.name}`);

    const country: Country = this.countryMapper.toEntity(countryCreateInput);

    return await this.countryService.saveCountry(country);
  }

}
