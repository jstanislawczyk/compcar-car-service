import {Car} from '../../entities/car';
import {Field, ObjectType} from 'type-graphql';

@ObjectType()
export class CarsOutput {

  @Field(() => [Car])
  public readonly cars: Car[];

  @Field()
  public readonly count: number;
}
