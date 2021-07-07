import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {EntityAlreadyExistsError} from '../models/errors/entity-already-exists.error';
import {CountryRepository} from "../repositories/country.repository";
import {Country} from "../models/entities/country";
import {NotFoundError} from '../models/errors/not-found.error';

@Service()
export class CountryService {

  constructor(
    @InjectRepository()
    private readonly countryRepository: CountryRepository,
  ) {
  }

  public async findCountryById(id: number) {
    try {
      return await this.countryRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundError(`Country with id=${id} not found`);
    }
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
