import {InputType, Field} from 'type-graphql';
import {IsNumber, IsString, MaxLength, MinLength} from 'class-validator';

@InputType()
export class UpdateAddonInput {

  @Field()
  @IsNumber()
  public readonly id: number;

  @Field({
    nullable: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(128)
  public readonly name?: string;

  @Field({
    nullable: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(256)
  public readonly description?: string;
}
