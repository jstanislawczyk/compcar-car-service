import {InputType, Field} from 'type-graphql';
import {IsNumber, IsPositive} from 'class-validator';

@InputType()
export class PaintingCreateInput {

  @Field()
  @IsNumber()
  @IsPositive()
  public readonly price: number;

}
