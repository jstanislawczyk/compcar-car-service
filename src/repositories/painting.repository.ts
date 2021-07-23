import {EntityRepository, Repository} from 'typeorm';
import {Painting} from '../models/entities/painting';

@EntityRepository(Painting)
export class PaintingRepository extends Repository<Painting> {

}
