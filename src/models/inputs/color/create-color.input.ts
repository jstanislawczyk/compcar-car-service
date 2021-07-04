import {InputType, Field} from 'type-graphql';
import {IsHexColor, IsString, Matches, MaxLength, MinLength} from 'class-validator';

@InputType()
export class CreateColorInput {

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  public readonly name: string;

  @Field()
  @IsHexColor()
  public readonly hexCode: string;
}
