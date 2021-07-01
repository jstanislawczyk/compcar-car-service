import {InputType, Field} from 'type-graphql';
import {IsInt, IsString, Max, MaxLength, Min, MinLength} from 'class-validator';

@InputType()
export class CreateCommentInput {

  @Field()
  @IsString()
  @MinLength(3)
  @MaxLength(512)
  public readonly text: string;

  @Field()
  @IsInt()
  @Min(1)
  @Max(5)
  public readonly rating: number;
}
