import {Service} from 'typedi';
import {CreateAddonInput} from '../models/inputs/addon/create-addon.input';
import {Addon} from '../models/entities/addon';
import {UpdateAddonInput} from '../models/inputs/addon/update-addon.input';
import {AddonUpdate} from '../models/common/update/addon-update';

@Service()
export class AddonMapper {

  public toEntity(createAddonInput: CreateAddonInput): Addon {
    return {
      name: createAddonInput.name,
      description: createAddonInput.description,
    };
  }

  public toUpdateModel(updateAddonInput: UpdateAddonInput): AddonUpdate {
    return {
      id: updateAddonInput.id,
      name: updateAddonInput.name,
      description: updateAddonInput.description,
    };
  }
}
