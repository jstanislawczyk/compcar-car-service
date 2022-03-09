import {EntityRepository, Repository} from 'typeorm';
import {Generation} from '../models/entities/generation';

@EntityRepository(Generation)
export class GenerationRepository extends Repository<Generation> {

}
