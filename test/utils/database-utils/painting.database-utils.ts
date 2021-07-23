import {getRepository, MoreThan, Repository} from 'typeorm';
import {Painting} from '../../../src/models/entities/painting';

export class PaintingDatabaseUtils {

  public static getAllPaintings(): Promise<Painting[]> {
    return this.getPaintingRepository().find();
  }

  public static getPaintingById(id: number): Promise<Painting | undefined> {
    return this.getPaintingRepository().findOne({ id });
  }

  public static getPaintingByIdOrFail(id: number): Promise<Painting> {
    return this.getPaintingRepository().findOneOrFail({ id });
  }

  public static savePainting(Painting: Painting): Promise<Painting> {
    return this.getPaintingRepository().save(Painting);
  }

  public static savePaintingsList(Paintings: Painting[]): Promise<Painting[]> {
    return this.getPaintingRepository().save(Paintings);
  }

  public static async deleteAllPaintings(): Promise<void> {
    const numberOfPaintings: number = await this.countPaintings();

    if (numberOfPaintings > 0) {
      await this.getPaintingRepository().delete({
        id: MoreThan(0),
      });
    }
  }

  public static async countPaintings(): Promise<number> {
    return this.getPaintingRepository().count();
  }

  private static getPaintingRepository(): Repository<Painting> {
    return getRepository(Painting);
  }
}
