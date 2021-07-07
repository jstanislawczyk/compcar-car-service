import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {BrandRepository} from '../repositories/brand.repository';
import {Brand} from '../models/entities/brand';

@Service()
export class BrandService {

  constructor(
    @InjectRepository()
    private readonly brandRepository: BrandRepository,
  ) {
  }

  public saveBrand(brand: Brand): Promise<Brand> {
    return this.brandRepository.save(brand);
  }
}
