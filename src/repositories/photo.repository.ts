import {EntityRepository, Repository} from 'typeorm';
import {Photo} from '../models/entities/photo';

@EntityRepository(Photo)
export class PhotoRepository extends Repository<Photo> {

}
