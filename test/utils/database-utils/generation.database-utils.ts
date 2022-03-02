import {getRepository, MoreThan, Repository} from 'typeorm';
import {Generation} from '../../../src/models/entities/generation';

export class GenerationDatabaseUtils {

  public static getAllGenerations(): Promise<Generation[]> {
    return this.getGenerationRepository().find();
  }

  public static getGenerationById(id: number): Promise<Generation | undefined> {
    return this.getGenerationRepository().findOne({ id });
  }

  public static getGenerationByIdOrFail(id: number): Promise<Generation> {
    return this.getGenerationRepository().findOneOrFail({ id });
  }

  public static saveGeneration(generation: Generation): Promise<Generation> {
    return this.getGenerationRepository().save(generation);
  }

  public static saveGenerationsList(generations: Generation[]): Promise<Generation[]> {
    return this.getGenerationRepository().save(generations);
  }

  public static async deleteAllGenerations(): Promise<void> {
    const numberOfGenerations: number = await this.countGenerations();

    if (numberOfGenerations > 0) {
      await this.getGenerationRepository().delete({
        id: MoreThan(0),
      });
    }
  }

  public static async countGenerations(): Promise<number> {
    return this.getGenerationRepository().count();
  }

  private static getGenerationRepository(): Repository<Generation> {
    return getRepository(Generation);
  }
}
