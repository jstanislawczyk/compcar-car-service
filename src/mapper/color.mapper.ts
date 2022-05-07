import {Service} from 'typedi';
import {CreateColorInput} from '../models/inputs/color/create-color.input';
import {Color} from '../models/entities/color';
import {UpdateColorInput} from '../models/inputs/color/update-color.input';
import {ColorUpdate} from '../models/common/update/color-update';

@Service()
export class ColorMapper {

  public toEntity(createCommentInput: CreateColorInput): Color {
    return {
      name: createCommentInput.name,
      hexCode: this.getSanitizedHexCode(createCommentInput.hexCode),
    };
  }

  public toUpdateModel(updateColorInput: UpdateColorInput): ColorUpdate {
    return {
      id: updateColorInput.id,
      name: updateColorInput.name,
      hexCode: updateColorInput.hexCode
        ? this.getSanitizedHexCode(updateColorInput.hexCode)
        : undefined,
    };
  }

  private getSanitizedHexCode(hexCode: string): string {
    hexCode = hexCode.toUpperCase();

    if (this.isLongHexCodeThatCanBeShorter(hexCode)) {
      hexCode = `#${hexCode.charAt(1)}${hexCode.charAt(3)}${hexCode.charAt(5)}`;
    }

    return hexCode;
  }

  private isLongHexCodeThatCanBeShorter(hexCode: string): boolean {
    return hexCode.length === 7 &&
        hexCode.charAt(1) === hexCode.charAt(2) &&
        hexCode.charAt(3) === hexCode.charAt(4) &&
        hexCode.charAt(5) === hexCode.charAt(6);
  }
}
