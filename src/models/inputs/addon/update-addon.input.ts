import {InputType, Field} from 'type-graphql';
import {IsNumber, IsString, MaxLength, MinLength} from 'class-validator';

@InputType()
export class UpdateAddonInput {

  @Field()
  @IsNumber()
  public readonly id: number;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  public readonly name?: string;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  public readonly description?: string;
}
