import {Resolver, Query, Arg} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {Car} from '../models/entities/car';
import {CarFacade} from '../facades/car.facade';

@Service()
@Resolver(() => Car)
export class CarResolver {

  constructor(
    private readonly carFacade: CarFacade,
  ) {
  }

  @Query(() => Car)
  public async getCarById(@Arg('id') id: number): Promise<Car> {
    Logger.log(`Fetching car with id=${id}`);

    return await this.carFacade.findCarById(id);
  }

}
