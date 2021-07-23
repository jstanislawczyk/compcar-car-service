import {Builder} from './builder';
import {Brand} from '../../../src/models/entities/brand';
import {BrandFixtureProvider} from '../fixture-providers/brand.fixture-provider';

export class BrandBuilder extends Builder<Brand> {

  constructor(populateOptionalFields: boolean = false) {
    const brand: Brand = BrandFixtureProvider.getValidBrand(populateOptionalFields);

    super(brand);
  }

  public withId(id: number): BrandBuilder {
    this.entity.id = id;
    return this;
  }

  public withName(name: string): BrandBuilder {
    this.entity.name = name;
    return this;
  }

  public withLogoPhotoUrl(logoPhotoUrl: string): BrandBuilder {
    this.entity.logoPhotoUrl = logoPhotoUrl;
    return this;
  }
}
