import {InputType, Field} from 'type-graphql';
import {IsString, IsUrl, MaxLength, MinLength} from 'class-validator';

@InputType()
export class CreateBrandInput {

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  public readonly name: string;

  @Field()
  @MinLength(2)
  @MaxLength(512)
  @IsUrl()
  public readonly logoPhotoUrl: string;
}
