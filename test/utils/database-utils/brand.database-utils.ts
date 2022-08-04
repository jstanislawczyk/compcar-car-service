import {getRepository, MoreThan, Repository} from 'typeorm';
import {Brand} from '../../../src/models/entities/brand';
import {FindOneOptions} from 'typeorm/find-options/FindOneOptions';

export class BrandDatabaseUtils {

  public static getAllBrands(): Promise<Brand[]> {
    return this.getBrandRepository().find();
  }

  public static getBrandById(id: number, options: FindOneOptions<Brand> = {}): Promise<Brand | undefined> {
    return this.getBrandRepository().findOne({ id }, options);
  }

  public static getBrandByIdOrFail(id: number, options: FindOneOptions<Brand> = {}): Promise<Brand> {
    return this.getBrandRepository().findOneOrFail({ id }, options);
  }

  public static saveBrand(brand: Brand): Promise<Brand> {
    return this.getBrandRepository().save(brand);
  }

  public static saveBrandsList(brands: Brand[]): Promise<Brand[]> {
    return this.getBrandRepository().save(brands);
  }

  public static async deleteAllBrands(): Promise<void> {
    const numberOfBrands: number = await this.countBrands();

    if (numberOfBrands > 0) {
      await this.getBrandRepository().delete({
        id: MoreThan(0),
      });
    }
  }

  public static async countBrands(): Promise<number> {
    return this.getBrandRepository().count();
  }

  private static getBrandRepository(): Repository<Brand> {
    return getRepository(Brand);
  }
}
