import {InputType, Field} from 'type-graphql';
import {IsString, IsUrl, MaxLength, MinLength} from 'class-validator';

@InputType()
export class CreateCountryInput {

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  public readonly name: string;

  @Field()
  @IsUrl()
  public readonly flagPhotoUrl: string;
}
