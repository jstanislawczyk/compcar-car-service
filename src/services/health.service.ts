import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {UserRepository} from '../repositories/user.repository';
import {HealthStatus} from '../enums/health-status';
import {ApplicationHealth} from '../models/object-types/health/application-health';

@Service()
export class HealthService {

  constructor(
    @InjectRepository()
    private readonly userRepository: UserRepository,
  ) {
  }

  public async getApplicationHealth(): Promise<ApplicationHealth> {
    const applicationHealth: ApplicationHealth = new ApplicationHealth();

    applicationHealth.healthDetails.database.mysql = await this.getMysqlDatabaseHealthStatus();
    applicationHealth.generalStatus = await this.getGeneralApplicationHealthStatus(applicationHealth);

    return applicationHealth;
  }

  private async getMysqlDatabaseHealthStatus(): Promise<HealthStatus> {
    try {
      await this.userRepository.findOne();
      return HealthStatus.OK;
    } catch (error) {
      return HealthStatus.CRITICAL;
    }
  }

  private getGeneralApplicationHealthStatus(applicationHealth: ApplicationHealth): HealthStatus {
    return applicationHealth.healthDetails.database.mysql;
  }
}
