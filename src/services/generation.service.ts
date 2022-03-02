import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {GenerationRepository} from '../repositories/generation.repository';
import {Generation} from '../models/entities/generation';
import {NotFoundError} from '../models/errors/not-found.error';

@Service()
export class GenerationService {

  constructor(
    @InjectRepository()
    private readonly generationRepository: GenerationRepository,
  ) {
  }

  public async findOne(id: number): Promise<Generation> {
    try {
      return await this.generationRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundError(`Generation with id=${id} not found`);
    }
  }
}
