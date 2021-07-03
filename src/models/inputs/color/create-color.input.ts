import {InputType, Field} from 'type-graphql';
import {IsString, Matches, MaxLength, MinLength} from 'class-validator';

@InputType()
export class CreateColorInput {

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  public readonly name: string;

  @Field()
  @Matches(
    /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/i,
    { message: 'Given string is not valid hex code' }
  )
  public readonly hexCode: string;
}
