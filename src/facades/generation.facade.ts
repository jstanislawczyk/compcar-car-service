import {Service} from 'typedi';
import {GenerationService} from '../services/generation.service';
import {Generation} from '../models/entities/generation';

@Service()
export class GenerationFacade {

  constructor(
    private readonly generationService: GenerationService,
  ) {
  }

  public findGenerationById(id: number): Promise<Generation> {
    return this.generationService.findOne(id);
  }

}
