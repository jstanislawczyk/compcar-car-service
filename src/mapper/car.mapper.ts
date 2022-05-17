import {Service} from 'typedi';
import {CreateCarInput} from '../models/inputs/car/create-car.input';
import {CarCreate} from '../models/common/create/car.create';

@Service()
export class CarMapper {

  public toCreateModel(createCarInput: CreateCarInput): CarCreate {
    return {
      name: createCarInput.name,
      description: createCarInput.description,
      basePrice: createCarInput.basePrice,
      startYear: createCarInput.startYear,
      endYear: createCarInput.endYear,
      weight: createCarInput.weight,
      bodyStyle: createCarInput.bodyStyle,
      generationId: createCarInput.generationId,
      carAddonsIds: createCarInput.carAddonsIds,
      carEnginesIds: createCarInput.carEnginesIds,
      paintingIds: createCarInput.paintingIds,
      photosIds: createCarInput.photosIds,
    };
  }
}
