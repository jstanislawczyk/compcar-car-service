import {Service} from 'typedi';
import {CarService} from '../services/car.service';
import {CarsOutput} from '../models/object-types/car/cars.output';
import {PaginationOptions} from '../models/common/filters/paginationOptions';

@Service()
export class CarFacade {

  constructor(
    private readonly carService: CarService,
  ) {
  }

  public findAll(paginationOptions: PaginationOptions): Promise<CarsOutput> {
    return this.carService.findAllWithCount(paginationOptions);
  }
}
