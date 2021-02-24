import {registerDecorator, ValidationOptions} from 'class-validator';
import {MatchPropertyValidator} from '../../validators/match-property.validator';

export function MatchProperty(property: string, validationOptions?: ValidationOptions) {

  return (object: any, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchPropertyValidator,
    });
  };
}
