import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';

@ValidatorConstraint({
  name: 'MatchProperty',
})
export class MatchPropertyValidator implements ValidatorConstraintInterface {

  public validate(value: any, validationArguments: ValidationArguments): boolean {
    const relatedPropertyName: string = validationArguments.constraints[0];
    const validatedClass: Record<string, any> = validationArguments.object;

    return value === validatedClass[relatedPropertyName];
  }

  public defaultMessage(validationArguments: ValidationArguments): string {
    const relatedPropertyName: string = validationArguments.constraints[0];

    return `"${relatedPropertyName}" value doesn't match "${validationArguments.property}" property`;
  }
}
