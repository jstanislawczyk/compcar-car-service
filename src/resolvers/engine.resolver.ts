import {Resolver, Query, Arg} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {Engine} from '../models/entities/engine';
import {EngineService} from '../services/engine.service';

@Service()
@Resolver(() => Engine)
export class EngineResolver {

  constructor(
    private readonly engineService: EngineService,
  ) {
  }

  @Query(() => Engine)
  public async getEngineById(@Arg('id') id: number): Promise<Engine> {
    Logger.log(`Fetching engine with id=${id}`);

    return await this.engineService.findOne(id);
  }

}
