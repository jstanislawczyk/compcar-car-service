import {getRepository, MoreThan, Repository} from 'typeorm';
import {Engine} from '../../../src/models/entities/engine';
import {FindOneOptions} from 'typeorm/find-options/FindOneOptions';

export class EngineDatabaseUtils {

  public static getAllEngines(): Promise<Engine[]> {
    return this.getEngineRepository().find();
  }

  public static getEngineById(id: number, options: FindOneOptions<Engine> = {}): Promise<Engine | undefined> {
    return this.getEngineRepository().findOne({ id }, options);
  }

  public static getEngineByIdOrFail(id: number, options: FindOneOptions<Engine> = {}): Promise<Engine> {
    return this.getEngineRepository().findOneOrFail({ id }, options);
  }

  public static saveEngine(engine: Engine): Promise<Engine> {
    return this.getEngineRepository().save(engine);
  }

  public static saveEnginesList(engines: Engine[]): Promise<Engine[]> {
    return this.getEngineRepository().save(engines);
  }

  public static async deleteAllEngines(): Promise<void> {
    const numberOfEngines: number = await this.countEngines();

    if (numberOfEngines > 0) {
      await this.getEngineRepository().delete({
        id: MoreThan(0),
      });
    }
  }

  public static async countEngines(): Promise<number> {
    return this.getEngineRepository().count();
  }

  private static getEngineRepository(): Repository<Engine> {
    return getRepository(Engine);
  }
}
