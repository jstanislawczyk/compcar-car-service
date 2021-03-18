import {Field, ObjectType} from 'type-graphql';
import {DatabaseHealth} from './database-health';

@ObjectType()
export class HealthDetails {

  @Field(() => DatabaseHealth)
  public database: DatabaseHealth = new DatabaseHealth();
}
