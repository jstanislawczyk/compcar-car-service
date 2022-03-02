import {Resolver, Query, Arg} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {Generation} from '../models/entities/generation';
import {GenerationFacade} from '../facades/generation.facade';

@Service()
@Resolver(() => Generation)
export class GenerationResolver {

  constructor(
    private readonly generationFacade: GenerationFacade,
  ) {
  }

  @Query(() => Generation)
  public async getGenerationById(@Arg('id') id: number): Promise<Generation> {
    Logger.log(`Fetching generation with id=${id}`);

    return await this.generationFacade.findGenerationById(id);
  }

}
