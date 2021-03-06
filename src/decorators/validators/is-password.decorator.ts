import {registerDecorator} from 'class-validator';
import {IsPasswordValidator} from '../../validators/is-password.validator';

export function IsPassword() {

  return (object: any, propertyName: string): void => {
    registerDecorator({
      name: 'IsPassword',
      propertyName,
      validator: IsPasswordValidator,
      target: object.constructor,
    });
  };
}
