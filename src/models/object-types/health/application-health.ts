import {Field, ObjectType} from 'type-graphql';
import {HealthStatus} from '../../../enums/health-status';
import {HealthDetails} from './health-details';

@ObjectType()
export class ApplicationHealth {

  @Field()
  public generalStatus: HealthStatus = HealthStatus.OK;

  @Field(() => HealthDetails)
  public healthDetails: HealthDetails = new HealthDetails();
}
