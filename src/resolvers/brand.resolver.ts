import {Resolver, Arg, Mutation, Query, Authorized} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {Brand} from '../models/entities/brand';
import {BrandCountryFacade} from '../facades/brand-country.facade';
import {CreateBrandInput} from '../models/inputs/brand/create-brand.input';
import {BrandMapper} from '../mapper/brand.mapper';
import {UserRole} from '../models/enums/user-role';

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

  @Authorized(UserRole.ADMIN)
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
