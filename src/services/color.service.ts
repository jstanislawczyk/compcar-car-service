import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {ColorRepository} from '../repositories/color.repository';
import {Color} from '../models/entities/color';
import {EntityAlreadyExistsError} from '../models/errors/entity-already-exists.error';

@Service()
export class ColorService {

  constructor(
    @InjectRepository()
    private readonly colorRepository: ColorRepository,
  ) {
  }

  public findAll(): Promise<Color[]> {
    return this.colorRepository.find();
  }

  public async saveColor(color: Color): Promise<Color> {
    color.hexCode = this.getSanitizedHexCode(color.hexCode);
    const existingColors: Color[] = await this.colorRepository.find({
      select: ['id'],
      where: [
        { name: color.name },
        { hexCode: color.hexCode },
      ],
    });

    if (existingColors.length > 0) {
      throw new EntityAlreadyExistsError('Color with given name or hex code already exists');
    }

    return this.colorRepository.save(color);
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
