import {getRepository, MoreThan, Repository} from 'typeorm';
import {Car} from '../../../src/models/entities/car';
import {FindOneOptions} from 'typeorm/find-options/FindOneOptions';

export class CarDatabaseUtils {

  public static getAllCars(): Promise<Car[]> {
    return this.getCarRepository().find();
  }

  public static getCarById(id: number, options: FindOneOptions<Car> = {}): Promise<Car | undefined> {
    return this.getCarRepository().findOne({ id }, options);
  }

  public static getCarByIdOrFail(id: number, options: FindOneOptions<Car> = {}): Promise<Car> {
    return this.getCarRepository().findOneOrFail({ id }, options);
  }

  public static saveCar(car: Car): Promise<Car> {
    return this.getCarRepository().save(car);
  }

  public static saveCarsList(cars: Car[]): Promise<Car[]> {
    return this.getCarRepository().save(cars);
  }

  public static async deleteAllCars(): Promise<void> {
    const numberOfCars: number = await this.countCars();

    if (numberOfCars > 0) {
      await this.getCarRepository().delete({
        id: MoreThan(0),
      });
    }
  }

  public static async countCars(): Promise<number> {
    return this.getCarRepository().count();
  }

  private static getCarRepository(): Repository<Car> {
    return getRepository(Car);
  }
}
