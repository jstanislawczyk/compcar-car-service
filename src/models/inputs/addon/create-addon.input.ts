import {InputType, Field} from 'type-graphql';
import {IsString, MaxLength, MinLength} from 'class-validator';

@InputType()
export class CreateAddonInput {

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(128)
  public readonly name: string;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(256)
  public readonly description: string;
}
