import {Service} from 'typedi';
import {ColorCreateInput} from '../models/inputs/color/color-create.input';
import {Color} from '../models/entities/color';

@Service()
export class ColorMapper {

  public toEntity(commentCreateInput: ColorCreateInput): Color {
    return {
      name: commentCreateInput.name,
      hexCode: commentCreateInput.hexCode,
    };
  }
}
