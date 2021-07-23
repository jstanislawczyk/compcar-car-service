import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {BrandRepository} from '../repositories/brand.repository';
import {Brand} from '../models/entities/brand';
import {EntityAlreadyExistsError} from '../models/errors/entity-already-exists.error';
import {NotFoundError} from '../models/errors/not-found.error';

@Service()
export class BrandService {

  constructor(
    @InjectRepository()
    private readonly brandRepository: BrandRepository,
  ) {
  }

  public async findOne(id: number): Promise<Brand> {
    try {
      return await this.brandRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundError(`Brand with id=${id} not found`);
    }
  }

  public async saveBrand(brand: Brand): Promise<Brand> {
    const existingBrand: Brand | undefined = await this.brandRepository.findOne({
      select: ['id'],
      where: {
        name: brand.name,
      },
    });

    if (existingBrand !== undefined) {
      throw new EntityAlreadyExistsError(`Brand with name=${brand.name} already exists`);
    }

    return this.brandRepository.save(brand);
  }
}
