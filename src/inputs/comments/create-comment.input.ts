import {InputType, Field} from 'type-graphql';
import {IsInt, IsString, Max, Min} from 'class-validator';

@InputType()
export class CreateCommentInput {

  @Field()
  @IsString()
  public readonly text: string;

  @Field()
  @IsInt()
  @Min(1)
  @Max(5)
  public readonly rating: number;
}
