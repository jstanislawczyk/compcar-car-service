import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {ColorRepository} from '../repositories/color.repository';
import {Color} from '../models/entities/color';

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

  public saveColor(color: Color): Promise<Color> {
    return this.colorRepository.save(color);
  }
}
