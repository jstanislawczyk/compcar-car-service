import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';

@ValidatorConstraint({
  name: 'isGreaterOrEqualThan',
})
export class IsGreaterOrEqualThanValidator implements ValidatorConstraintInterface {

  public validate(value: number, validationArguments: ValidationArguments): boolean {
    const validatedObject: Record<string, any> = validationArguments.object;
    const propertyValueToCompare: number = validatedObject[validationArguments.constraints[0]];

    return value >= propertyValueToCompare;
  }

  public defaultMessage(validationArguments: ValidationArguments): string {
    return `${validationArguments.property} should be greater or equal than ${validationArguments.constraints[0]}`;
  }
}
