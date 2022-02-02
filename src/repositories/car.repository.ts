import {EntityRepository, Repository} from 'typeorm';
import {Car} from '../models/entities/car';

@EntityRepository(Car)
export class CarRepository extends Repository<Car> {

}
