import {Field, ObjectType} from 'type-graphql';
import {HealthStatus} from '../../../enums/health-status';

@ObjectType()
export class DatabaseHealth {

  @Field()
  public mysql: HealthStatus;
}
