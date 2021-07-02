import {Resolver, Query} from 'type-graphql';
import {Service} from 'typedi';
import {Logger} from '../common/logger';
import {HealthService} from '../services/health.service';
import {ApplicationHealth} from '../models/object-types/health/application-health';

@Service()
@Resolver(() => ApplicationHealth)
export class HealthResolver {

  constructor(
    private readonly healthService: HealthService,
  ) {
  }

  @Query(() => ApplicationHealth)
  public async getApplicationHealth(): Promise<ApplicationHealth> {
    Logger.log('Health check');

    return await this.healthService.getApplicationHealth();
  }

}
