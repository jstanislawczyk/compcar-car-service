import {EntityRepository, Repository} from 'typeorm';
import {Addon} from '../models/entities/addon';

@EntityRepository(Addon)
export class AddonRepository extends Repository<Addon> {

}
