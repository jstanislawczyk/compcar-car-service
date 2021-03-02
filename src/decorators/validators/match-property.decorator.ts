import {registerDecorator, ValidationOptions} from 'class-validator';
import {MatchPropertyValidator} from '../../validators/match-property.validator';

export function MatchProperty(property: string) {

  return (object: any, propertyName: string): void => {
    registerDecorator({
      name: 'MatchProperty',
      propertyName,
      constraints: [property],
      validator: MatchPropertyValidator,
      target: object.constructor,
    });
  };
}
