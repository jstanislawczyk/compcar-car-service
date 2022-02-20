import {EntityRepository, Repository} from 'typeorm';
import {Model} from '../models/entities/model';

@EntityRepository(Model)
export class ModelRepository extends Repository<Model> {

}
