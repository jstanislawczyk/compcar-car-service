import {EntityRepository, Repository} from 'typeorm';
import {Engine} from '../models/entities/engine';

@EntityRepository(Engine)
export class EngineRepository extends Repository<Engine> {

}
