import {InputType, Field} from 'type-graphql';
import {IsHexColor, IsNumber, IsString, MaxLength, MinLength} from 'class-validator';

@InputType()
export class UpdateColorInput {

  @Field()
  @IsNumber()
  public readonly id: number;

  @Field({
    nullable: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  public readonly name?: string;

  @Field({
    nullable: true,
  })
  @IsHexColor()
  public readonly hexCode?: string;
}
