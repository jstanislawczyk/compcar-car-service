import {Field, ObjectType} from 'type-graphql';
import {Model} from '../../entities/model';

@ObjectType()
export class ModelsWithCountOutput {

  @Field(() => [Model])
  public readonly models: Model[];

  @Field()
  public readonly count: number;
}
