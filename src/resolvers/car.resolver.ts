import {Resolver, Query, Arg, Mutation, Authorized} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {Car} from '../models/entities/car';
import {CarFacade} from '../facades/car.facade';
import {CreateCarInput} from '../models/inputs/car/create-car.input';
import {CarCreate} from '../models/common/create/car.create';
import {CarMapper} from '../mapper/car.mapper';
import {UserRole} from '../models/enums/user-role';

@Service()
@Resolver(() => Car)
export class CarResolver {

  constructor(
    private readonly carFacade: CarFacade,
    private readonly carMapper: CarMapper,
  ) {
  }

  @Query(() => [Car])
  public async getCars(): Promise<Car[]> {
    Logger.log('Fetching all cars');

    return await this.carFacade.findAllCars();
  }

  @Query(() => Car)
  public async getCarById(@Arg('id') id: number): Promise<Car> {
    Logger.log(`Fetching car with id=${id}`);

    return await this.carFacade.findCarById(id);
  }

  @Authorized(UserRole.ADMIN)
  @Mutation(() => Car)
  public async createCar(
    @Arg('createCarInput') createCarInput: CreateCarInput,
  ): Promise<Car> {
    const carCreate: CarCreate = this.carMapper.toCreateModel(createCarInput);

    return this.carFacade.createCar(carCreate);
  }
}
