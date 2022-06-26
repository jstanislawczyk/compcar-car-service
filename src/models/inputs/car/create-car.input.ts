import {InputType, Field, Int} from 'type-graphql';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {BodyStyle} from '../../enums/body-style';
import {IsGreaterThanOrEqual} from '../../../decorators/validators/is-greater-than-or-equal.decorator';

@InputType()
export class CreateCarInput {

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  public readonly name: string;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(256)
  public readonly description: string;

  @Field()
  @IsNumber()
  @IsPositive()
  public readonly basePrice: number;

  @Field()
  @IsPositive()
  @IsNumber()
  public startYear: number;

  @Field({
    nullable: true,
  })
  @IsGreaterThanOrEqual('startYear')
  @IsPositive()
  @IsNumber()
  @IsOptional()
  public endYear?: number;

  @Field()
  @IsNumber()
  @IsPositive()
  public weight: number;

  @Field()
  @IsNotEmpty()
  @IsEnum(BodyStyle)
  public bodyStyle: BodyStyle;

  @Field()
  @IsNumber()
  @IsPositive()
  public generationId: number;

  @Field(
    () => [Int],
    {
      nullable: true,
    },
  )
  @IsNumber(
    {},
    {
      each: true,
    },
  )
  @IsArray()
  @IsOptional()
  public photosIds?: number[];

  @Field(
    () => [Int],
    {
      nullable: true,
    },
  )
  @IsNumber(
    {},
    {
      each: true,
    },
  )
  @IsArray()
  @IsOptional()
  public carAddonsIds?: number[];

  @Field(
    () => [Int],
    {
      nullable: true,
    },
  )
  @IsNumber(
    {},
    {
      each: true,
    },
  )
  @IsArray()
  @IsOptional()
  public carEnginesIds?: number[];

  @Field(
    () => [Int],
    {
      nullable: true,
    },
  )
  @IsNumber(
    {},
    {
      each: true,
    },
  )
  @IsArray()
  @IsOptional()
  public paintingIds?: number[];
}
