import {getRepository, MoreThan, Repository} from 'typeorm';
import {Car} from '../../../src/models/entities/car';

export class CarDatabaseUtils {

  public static getAllCars(): Promise<Car[]> {
    return this.getCarRepository().find();
  }

  public static getCarById(id: number): Promise<Car | undefined> {
    return this.getCarRepository().findOne({ id });
  }

  public static getCarByIdOrFail(id: number): Promise<Car> {
    return this.getCarRepository().findOneOrFail({ id });
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
