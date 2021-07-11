import {Brand} from '../../../src/models/entities/brand';
import {brand, fullBrand} from '../../fixtures/brand.fixture';

export class BrandFixtureProvider {

  public static getValidBrand(populateOptionalFields: boolean = false): Brand {
    const validBrand: Brand = populateOptionalFields ? fullBrand : brand;

    return Object.assign({}, validBrand);
  }
}
