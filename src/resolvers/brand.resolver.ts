import {Resolver, Arg, Mutation} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {Brand} from '../models/entities/brand';
import {BrandCountryFacade} from '../facades/brand-country.facade';
import {CreateBrandInput} from '../models/inputs/brand/create-brand.input';
import {BrandMapper} from '../mapper/brand.mapper';

@Service()
@Resolver(() => Brand)
export class BrandResolver {

  constructor(
    private readonly brandCountryFacade: BrandCountryFacade,
    private readonly brandMapper: BrandMapper,
  ) {
  }

  @Mutation(() => Brand)
  public async createBrand(
    @Arg('countryId') countryId: number,
    @Arg('createBrandInput') createBrandInput: CreateBrandInput,
  ): Promise<Brand> {
    Logger.log(`Saving new brand with name=${createBrandInput.name}`);

    const brand: Brand = this.brandMapper.toEntity(createBrandInput);

    return await this.brandCountryFacade.saveBrandWithCountry(brand, countryId);
  }

}
