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
}
