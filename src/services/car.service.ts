import {Car} from '../models/entities/car';
import {CarRepository} from '../repositories/car.repository';
import {CarsOutput} from '../models/object-types/car/cars.output';
import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {PaginationOptions} from '../models/common/filters/paginationOptions';

@Service()
export class CarService {

  constructor(
    @InjectRepository()
    private readonly carRepository: CarRepository,
  ) {
  }

  public findAllWithCount(paginationOptions: PaginationOptions): Promise<CarsOutput> {
    return this.carRepository
      .findAndCount({
        skip: paginationOptions.skip,
        take: paginationOptions.take,
      })
      .then((carsWithCount: [Car[], number]) => ({
        cars: carsWithCount[0],
        count: carsWithCount[1],
      }));
  }
}
