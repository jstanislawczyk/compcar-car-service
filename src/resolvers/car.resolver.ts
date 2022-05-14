import {Resolver, Query, Arg, Mutation} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {Car} from '../models/entities/car';
import {CarFacade} from '../facades/car.facade';
import {CreateCarInput} from '../models/inputs/car/create-car.input';

@Service()
@Resolver(() => Car)
export class CarResolver {

  constructor(
    private readonly carFacade: CarFacade,
  ) {
  }

  @Query(() => [Car])
  public async getAllCars(): Promise<Car[]> {
    Logger.log('Fetching all cars');

    return await this.carFacade.findAllCars();
  }

  @Query(() => Car)
  public async getCarById(@Arg('id') id: number): Promise<Car> {
    Logger.log(`Fetching car with id=${id}`);

    return await this.carFacade.findCarById(id);
  }

  @Mutation(() => Car)
  public async createCar(
    @Arg('createCarInput') createCarInput: CreateCarInput,
  ): Promise<Car> {
    return {
      id: 1,
    } as Car;
  }
}
