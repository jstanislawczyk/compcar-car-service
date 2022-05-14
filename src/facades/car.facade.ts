import {Service} from 'typedi';
import {CarService} from '../services/car.service';
import {Car} from '../models/entities/car';

@Service()
export class CarFacade {

  constructor(
    private readonly carService: CarService,
  ) {
  }

  public findAllCars(): Promise<Car[]> {
    return this.carService.findAll();
  }

  public findCarById(id: number): Promise<Car> {
    return this.carService.findOne(id);
  }

}
