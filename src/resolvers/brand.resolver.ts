import {Resolver, Arg, Mutation, Query} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {Brand} from '../models/entities/brand';
import {BrandCountryFacade} from '../facades/brand-country.facade';
import {BrandCreateInput} from '../models/inputs/brand/brand-create.input';
import {BrandMapper} from '../mapper/brand.mapper';

@Service()
@Resolver(() => Brand)
export class BrandResolver {

  constructor(
    private readonly brandCountryFacade: BrandCountryFacade,
    private readonly brandMapper: BrandMapper,
  ) {
  }

  @Query(() => Brand)
  public async getBrandById(@Arg('id') id: number): Promise<Brand> {
    Logger.log(`Fetching brand with id=${id}`);

    return await this.brandCountryFacade.findOne(id);
  }

  @Mutation(() => Brand)
  public async createBrand(
    @Arg('countryId') countryId: number,
    @Arg('brandCreateInput') brandCreateInput: BrandCreateInput,
  ): Promise<Brand> {
    Logger.log(`Saving new brand with name=${brandCreateInput.name}`);

    const brand: Brand = this.brandMapper.toEntity(brandCreateInput);

    return await this.brandCountryFacade.saveBrandWithCountry(brand, countryId);
  }

}
