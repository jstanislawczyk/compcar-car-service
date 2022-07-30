import {getRepository, MoreThan, Repository} from 'typeorm';
import {Addon} from '../../../src/models/entities/addon';
import {FindOneOptions} from 'typeorm/find-options/FindOneOptions';

export class AddonDatabaseUtils {

  public static getAllAddons(): Promise<Addon[]> {
    return this.getAddonRepository().find();
  }

  public static getAddonById(id: number, options: FindOneOptions<Addon> = {}): Promise<Addon | undefined> {
    return this.getAddonRepository().findOne({ id }, options);
  }

  public static getAddonByIdOrFail(id: number, options: FindOneOptions<Addon> = {}): Promise<Addon> {
    return this.getAddonRepository().findOneOrFail({ id }, options);
  }

  public static saveAddon(addon: Addon): Promise<Addon> {
    return this.getAddonRepository().save(addon);
  }

  public static saveAddonsList(addons: Addon[]): Promise<Addon[]> {
    return this.getAddonRepository().save(addons);
  }

  public static async deleteAllAddons(): Promise<void> {
    const numberOfAddons: number = await this.countAddons();

    if (numberOfAddons > 0) {
      await this.getAddonRepository().delete({
        id: MoreThan(0),
      });
    }
  }

  public static async countAddons(): Promise<number> {
    return this.getAddonRepository().count();
  }

  private static getAddonRepository(): Repository<Addon> {
    return getRepository(Addon);
  }
}
