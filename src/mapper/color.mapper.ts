import {Service} from 'typedi';
import {CreateColorInput} from '../models/inputs/color/create-color.input';
import {Color} from '../models/entities/color';

@Service()
export class ColorMapper {

  public toEntity(createCommentInput: CreateColorInput): Color {
    return {
      name: createCommentInput.name,
      hexCode: createCommentInput.hexCode,
    };
  }
}
