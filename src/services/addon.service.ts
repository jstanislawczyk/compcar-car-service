import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {AddonRepository} from "../repositories/addon.repository";
import {Addon} from "../models/entities/addon";
import {NotFoundError} from '../models/errors/not-found.error';
import {DuplicateEntryError} from '../models/errors/duplicate-entry.error';
import {AddonUpdate} from '../models/common/update/addon.update';

@Service()
export class AddonService {

  constructor(
    @InjectRepository()
    private readonly addonRepository: AddonRepository,
  ) {
  }

  public findAll(): Promise<Addon[]> {
    return this.addonRepository.find();
  }

  public async saveAddon(addon: Addon): Promise<Addon> {
    try {
      return await this.addonRepository.save(addon);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new DuplicateEntryError(error.message);
      } else {
        throw error;
      }
    }
  }

  public async updateAddon(addonUpdate: AddonUpdate): Promise<Addon> {
    const existingAddon: Addon | undefined = await this.addonRepository.findOne(addonUpdate.id);

    if (existingAddon === undefined) {
      throw new NotFoundError(`Addon with id=${addonUpdate.id} not found`);
    }

    if (addonUpdate.name) {
      existingAddon.name = addonUpdate.name;
    }

    if (addonUpdate.description) {
      existingAddon.description = addonUpdate.description;
    }

    return await this.saveAddon(existingAddon);
  }
}
