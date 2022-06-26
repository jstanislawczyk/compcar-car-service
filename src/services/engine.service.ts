import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {EngineRepository} from '../repositories/engine.repository';
import {Engine} from '../models/entities/engine';
import {NotFoundError} from '../models/errors/not-found.error';

@Service()
export class EngineService {

  constructor(
    @InjectRepository()
    private readonly engineRepository: EngineRepository,
  ) {
  }

  public async findOne(id: number): Promise<Engine> {
    try {
      return await this.engineRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundError(`Engine with id=${id} not found`);
    }
  }

  public async findByIds(ids: number[]): Promise<Engine[]> {
    return this.engineRepository.findByIds(ids);
  }
}
