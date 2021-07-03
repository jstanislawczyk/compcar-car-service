import {EntityRepository, Repository} from 'typeorm';
import {Color} from '../models/entities/color';

@EntityRepository(Color)
export class ColorRepository extends Repository<Color> {

}
