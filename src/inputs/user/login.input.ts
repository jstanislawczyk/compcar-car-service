import {InputType, Field} from 'type-graphql';
import {IsString} from 'class-validator';

@InputType()
export class LoginInput {

  @Field()
  @IsString()
  public readonly email: string;

  @Field()
  @IsString()
  public readonly password: string;
}
