import {Resolver, Arg, Mutation, Query, Authorized} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {Addon} from '../models/entities/addon';
import {AddonService} from '../services/addon.service';
import {CreateAddonInput} from '../models/inputs/addon/create-addon.input';
import {AddonMapper} from '../mapper/addon.mapper';
import {UpdateAddonInput} from '../models/inputs/addon/update-addon.input';
import {AddonUpdate} from '../models/common/update/addon.update';
import {UserRole} from '../models/enums/user-role';

@Service()
@Resolver(() => Addon)
export class AddonResolver {

  constructor(
    private readonly addonService: AddonService,
    private readonly addonMapper: AddonMapper,
  ) {
  }

  @Query(() => [Addon])
  public async getAddons(): Promise<Addon[]> {
    Logger.log('Fetching all addons');

    return await this.addonService.findAll();
  }

  @Authorized(UserRole.ADMIN)
  @Mutation(() => Addon)
  public async createAddon(
    @Arg('createAddonInput') createAddonInput: CreateAddonInput,
  ): Promise<Addon> {
    Logger.log(`Saving new addon with name=${createAddonInput.name}`);

    const addon: Addon = this.addonMapper.toEntity(createAddonInput);

    return await this.addonService.saveAddon(addon);
  }

  @Authorized(UserRole.ADMIN)
  @Mutation(() => Addon)
  public async updateAddon(
    @Arg('updateAddonInput') updateAddonInput: UpdateAddonInput,
  ): Promise<Addon> {
    Logger.log(`Updating addon with id=${updateAddonInput.id}`);

    const addon: AddonUpdate = this.addonMapper.toUpdateModel(updateAddonInput);

    return await this.addonService.updateAddon(addon);
  }
}
