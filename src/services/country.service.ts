import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {EntityAlreadyExistsError} from '../models/errors/entity-already-exists.error';
import {CountryRepository} from "../repositories/country.repository";
import {Country} from "../models/entities/country";

@Service()
export class CountryService {

  constructor(
    @InjectRepository()
    private readonly countryRepository: CountryRepository,
  ) {
  }

  public async saveCountry(country: Country): Promise<Country> {
    const existingCountry: Country | undefined = await this.countryRepository.findOne({
      select: ['id'],
      where: {
        name: country.name,
      },
    });

    if (existingCountry !== undefined) {
      throw new EntityAlreadyExistsError(`Country with name=${country.name} already exists`);
    }

    return this.countryRepository.save(country);
  }
}
