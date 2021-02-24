import {InputType, Field} from 'type-graphql';
import {IsEmail, IsString} from 'class-validator';
import {MatchProperty} from '../../decorators/validators/match-property.decorator';
import {IsPassword} from '../../decorators/validators/is-password.decorator';

@InputType()
export class RegisterInput {

  @Field()
  @IsEmail()
  public readonly email: string;

  @Field()
  @IsString()
  @IsPassword()
  public readonly password: string;

  @Field()
  @IsString()
  @MatchProperty('password')
  public readonly passwordRepeat: string;
}
