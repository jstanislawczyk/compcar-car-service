import {Service} from 'typedi';
import {BrandCreateInput} from '../models/inputs/brand/brand-create.input';
import {Brand} from '../models/entities/brand';

@Service()
export class BrandMapper {

  public toEntity(brandCreateInput: BrandCreateInput): Brand {
    return {
      name: brandCreateInput.name,
      logoPhotoUrl: brandCreateInput.logoPhotoUrl,
    };
  }
}
