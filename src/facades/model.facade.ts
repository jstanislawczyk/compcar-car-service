import {Service} from 'typedi';
import {ModelService} from '../services/model.service';
import {ModelsWithCountOutput} from '../models/object-types/car/models-with-count-output';
import {PaginationOptions} from '../models/common/filters/paginationOptions';
import {Model} from '../models/entities/model';

@Service()
export class ModelFacade {

  constructor(
    private readonly modelService: ModelService,
  ) {
  }

  public findAllModelsWithCount(paginationOptions: PaginationOptions): Promise<ModelsWithCountOutput> {
    return this.modelService.findAllWithCount(paginationOptions);
  }

  public findModelById(id: number): Promise<Model> {
    return this.modelService.findOne(id);
  }
}
