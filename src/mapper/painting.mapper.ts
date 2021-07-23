import {Service} from 'typedi';
import {Painting} from '../models/entities/painting';
import {PaintingCreateInput} from '../models/inputs/painting/painting-create.input';

@Service()
export class PaintingMapper {

  public toEntity(paintingCreateInput: PaintingCreateInput): Painting {
    return {
      price: paintingCreateInput.price,
    };
  }

}
