import {ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';

@ValidatorConstraint({
  name: 'isPassword',
})
export class IsPasswordValidator implements ValidatorConstraintInterface {

  public validate(value: string): boolean {
    const passwordRegexp = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}/g;

    return passwordRegexp.test(value);
  }

  public defaultMessage(): string {
    return 'Password should contain minimum six characters, at least one uppercase letter, one lowercase letter and one number';
  }
}
