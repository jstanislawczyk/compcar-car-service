import {Service} from 'typedi';
import {BrandService} from '../services/brand.service';
import {CountryService} from '../services/country.service';
import {Brand} from '../models/entities/brand';

@Service()
export class BrandCountryFacade {

  constructor(
    private readonly brandService: BrandService,
    private readonly countryService: CountryService,
  ) {
  }

  public async findOne(id: number): Promise<Brand> {
    return this.brandService.findOne(id);
  }

  public async saveBrandWithCountry(brand: Brand, countryId: number): Promise<Brand> {
    brand.country = await this.countryService.findCountryById(countryId);

    return this.brandService.saveBrand(brand);
  }
}
