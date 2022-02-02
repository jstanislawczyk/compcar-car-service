import {Field, InputType} from 'type-graphql';
import {IsNumber, IsOptional, Min} from 'class-validator';

@InputType()
export class PaginationInput {

  @Field()
  @Min(1)
  @IsNumber()
  @IsOptional()
  public readonly pageNumber: number = 1;

  @Field()
  @Min(0)
  @IsNumber()
  @IsOptional()
  public readonly pageSize: number = 10;
}
