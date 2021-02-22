import {InputType, Field} from 'type-graphql';
import {IsString} from 'class-validator';

@InputType()
export class RegisterUserInput {

  @Field()
  @IsString()
  public email: string;

  @Field()
  @IsString()
  public password: string;
}
