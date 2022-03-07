import {Resolver, Query, Arg} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {ModelFacade} from '../facades/model.facade';
import {ModelsWithCountOutput} from '../models/object-types/car/models-with-count-output';
import {PaginationInput} from '../models/inputs/pagination/pagination.input';
import {PaginationMapper} from '../mapper/pagination.mapper';
import {PaginationOptions} from '../models/common/filters/paginationOptions';
import {Model} from '../models/entities/model';

@Service()
@Resolver(() => Model)
export class ModelResolver {

  constructor(
    private readonly modelFacade: ModelFacade,
    private readonly paginationMapper: PaginationMapper,
  ) {
  }

  @Query(() => ModelsWithCountOutput)
  public async getModelsWithCount(
    @Arg('pagination') paginationInput: PaginationInput,
  ): Promise<ModelsWithCountOutput> {
    Logger.log(`Fetching car models with count [page=${paginationInput.pageNumber}, size=${paginationInput.pageSize}]`);

    const paginationOptions: PaginationOptions = this.paginationMapper.toPaginationOptions(paginationInput);

    return await this.modelFacade.findAllModelsWithCount(paginationOptions);
  }

  @Query(() => Model)
  public async getModelById(@Arg('id') id: number): Promise<Model> {
    Logger.log(`Fetching model with id=${id}`);

    return await this.modelFacade.findModelById(id);
  }
}
