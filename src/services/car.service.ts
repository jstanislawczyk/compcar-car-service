import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {CarRepository} from '../repositories/car.repository';
import {Car} from '../models/entities/car';
import {NotFoundError} from '../models/errors/not-found.error';

@Service()
export class CarService {

  constructor(
    @InjectRepository()
    private readonly carRepository: CarRepository,
  ) {
  }

  public async findOne(id: number): Promise<Car> {
    try {
      return await this.carRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundError(`Car with id=${id} not found`);
    }
  }
}
