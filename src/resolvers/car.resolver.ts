import {Resolver, Query, Arg} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {Car} from '../models/entities/car';
import {CarFacade} from '../facades/car.facade';
import {CarsOutput} from '../models/object-types/car/cars.output';
import {PaginationInput} from '../models/inputs/pagination/pagination.input';
import {PaginationMapper} from '../mapper/pagination.mapper';
import {PaginationOptions} from '../models/common/filters/paginationOptions';

@Service()
@Resolver(() => Car)
export class BrandResolver {

  constructor(
    private readonly carFacade: CarFacade,
    private readonly paginationMapper: PaginationMapper,
  ) {
  }

  @Query(() => CarsOutput)
  public async getCarsWithCount(
    @Arg('pagination') paginationInput: PaginationInput,
  ): Promise<CarsOutput> {
    Logger.log(`Fetching cars with count [page=${paginationInput.pageNumber}, size=${paginationInput.pageSize}]`);

    const paginationOptions: PaginationOptions = this.paginationMapper.toPaginationOptions(paginationInput);

    return await this.carFacade.findAll(paginationOptions);
  }

}
