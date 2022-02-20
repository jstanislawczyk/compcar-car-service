import {ModelsWithCountOutput} from '../models/object-types/car/models-with-count-output';
import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {PaginationOptions} from '../models/common/filters/paginationOptions';
import {ModelRepository} from '../repositories/model.repository';
import {Model} from '../models/entities/model';

@Service()
export class ModelService {

  constructor(
    @InjectRepository()
    private readonly modelRepository: ModelRepository,
  ) {
  }

  public findAllWithCount(paginationOptions: PaginationOptions): Promise<ModelsWithCountOutput> {
    return this.modelRepository
      .findAndCount({
        skip: paginationOptions.skip,
        take: paginationOptions.take,
      })
      .then((carsWithCount: [Model[], number]) => ({
        models: carsWithCount[0],
        count: carsWithCount[1],
      }));
  }
}
