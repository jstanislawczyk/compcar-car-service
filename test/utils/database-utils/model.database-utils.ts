import {getRepository, MoreThan, Repository} from 'typeorm';
import {Model} from '../../../src/models/entities/model';
import {FindOneOptions} from 'typeorm/find-options/FindOneOptions';

export class ModelDatabaseUtils {

  public static getAllModels(): Promise<Model[]> {
    return this.getModelRepository().find();
  }

  public static getModelById(id: number, options: FindOneOptions<Model> = {}): Promise<Model | undefined> {
    return this.getModelRepository().findOne({ id }, options);
  }

  public static getModelByIdOrFail(id: number, options: FindOneOptions<Model> = {}): Promise<Model> {
    return this.getModelRepository().findOneOrFail({ id }, options);
  }

  public static saveModel(model: Model): Promise<Model> {
    return this.getModelRepository().save(model);
  }

  public static saveModelsList(models: Model[]): Promise<Model[]> {
    return this.getModelRepository().save(models);
  }

  public static async deleteAllModels(): Promise<void> {
    const numberOfBrands: number = await this.countModels();

    if (numberOfBrands > 0) {
      await this.getModelRepository().delete({
        id: MoreThan(0),
      });
    }
  }

  public static async countModels(): Promise<number> {
    return this.getModelRepository().count();
  }

  private static getModelRepository(): Repository<Model> {
    return getRepository(Model);
  }
}
