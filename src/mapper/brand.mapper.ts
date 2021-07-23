import {Service} from 'typedi';
import {CreateBrandInput} from '../models/inputs/brand/create-brand.input';
import {Brand} from '../models/entities/brand';

@Service()
export class BrandMapper {

  public toEntity(createBrandInput: CreateBrandInput): Brand {
    return {
      name: createBrandInput.name,
      logoPhotoUrl: createBrandInput.logoPhotoUrl,
    };
  }
}
