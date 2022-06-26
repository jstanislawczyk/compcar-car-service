import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {ColorRepository} from '../repositories/color.repository';
import {Color} from '../models/entities/color';
import {ColorUpdate} from '../models/common/update/color.update';
import {NotFoundError} from '../models/errors/not-found.error';
import {DuplicateEntryError} from '../models/errors/duplicate-entry.error';

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
    try {
      return await this.colorRepository.save(color);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new DuplicateEntryError(error.message);
      } else {
        throw error;
      }
    }
  }

  public async updateColor(colorUpdate: ColorUpdate): Promise<Color> {
    const existingColor: Color | undefined = await this.colorRepository.findOne(colorUpdate.id);

    if (existingColor === undefined) {
      throw new NotFoundError(`Color with id=${colorUpdate.id} not found`);
    }

    if (colorUpdate.name) {
      existingColor.name = colorUpdate.name;
    }

    if (colorUpdate.hexCode) {
      existingColor.hexCode = colorUpdate.hexCode;
    }

    return await this.saveColor(existingColor);
  }
}
