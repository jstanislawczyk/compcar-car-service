import {getRepository, MoreThan, Repository} from 'typeorm';
import {Color} from '../../../src/models/entities/color';
import {FindOneOptions} from 'typeorm/find-options/FindOneOptions';

export class ColorDatabaseUtils {

  public static getAllColors(): Promise<Color[]> {
    return this.getColorRepository().find();
  }

  public static getColorById(id: number, options: FindOneOptions<Color> = {}): Promise<Color | undefined> {
    return this.getColorRepository().findOne({ id }, options);
  }

  public static getColorByIdOrFail(id: number, options: FindOneOptions<Color> = {}): Promise<Color> {
    return this.getColorRepository().findOneOrFail({ id }, options);
  }

  public static saveColor(color: Color): Promise<Color> {
    return this.getColorRepository().save(color);
  }

  public static saveColorsList(colors: Color[]): Promise<Color[]> {
    return this.getColorRepository().save(colors);
  }

  public static async deleteAllColors(): Promise<void> {
    const numberOfColors: number = await this.countColors();

    if (numberOfColors > 0) {
      await this.getColorRepository().delete({
        id: MoreThan(0),
      });
    }
  }

  public static async countColors(): Promise<number> {
    return this.getColorRepository().count();
  }

  private static getColorRepository(): Repository<Color> {
    return getRepository(Color);
  }
}
