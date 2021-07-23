import {InputType, Field} from 'type-graphql';
import {IsHexColor, IsString, MaxLength, MinLength} from 'class-validator';

@InputType()
export class ColorCreateInput {

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  public readonly name: string;

  @Field()
  @IsHexColor()
  public readonly hexCode: string;
}
