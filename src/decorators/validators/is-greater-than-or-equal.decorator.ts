import {registerDecorator} from 'class-validator';
import {IsGreaterOrEqualThanValidator} from '../../validators/is-greater-or-equal-than.validator';

export function IsGreaterThanOrEqual(property: string) {

  return (object: any, propertyName: string): void => {
    registerDecorator({
      name: 'IsGreaterOrEqualThan',
      propertyName,
      validator: IsGreaterOrEqualThanValidator,
      target: object.constructor,
      constraints: [property],
    });
  };
}
