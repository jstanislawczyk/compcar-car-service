import {Service} from 'typedi';
import {ModelService} from '../services/model.service';
import {ModelsWithCountOutput} from '../models/object-types/car/models-with-count-output';
import {PaginationOptions} from '../models/common/filters/paginationOptions';

@Service()
export class ModelFacade {

  constructor(
    private readonly modelService: ModelService,
  ) {
  }

  public findAllWithCount(paginationOptions: PaginationOptions): Promise<ModelsWithCountOutput> {
    return this.modelService.findAllWithCount(paginationOptions);
  }
}
