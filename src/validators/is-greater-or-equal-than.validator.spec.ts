import {expect, use} from 'chai';
import sinon, {SinonSandbox} from 'sinon';
import sinonChai from 'sinon-chai';
import {ValidationArguments} from 'class-validator';
import {IsGreaterOrEqualThanValidator} from './is-greater-or-equal-than.validator';

use(sinonChai);

context('MatchProperty', () => {

  let sandbox: SinonSandbox;
  let isGreaterOrEqualThanValidator: IsGreaterOrEqualThanValidator;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    isGreaterOrEqualThanValidator = new IsGreaterOrEqualThanValidator();
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('validate', () => {
    it('should validate if property value is greater than compared property', () => {
      // Arrange
      const validatedProperty: string = 'validatedProperty';
      const validatedPropertyValue: number = 10;
      const comparedProperty: string = 'comparedProperty';
      const validationArguments: ValidationArguments = {
        constraints: [comparedProperty],
        property: validatedProperty,
        object: {
          [validatedProperty]: validatedPropertyValue,
          [comparedProperty]: 5,
        },
      } as ValidationArguments;

      // Act
      const isValid: boolean = isGreaterOrEqualThanValidator.validate(validatedPropertyValue, validationArguments);

      // Assert
      expect(isValid).to.be.true;
    });

    it('should validate if property value is equal to compared property', () => {
      // Arrange
      const validatedProperty: string = 'validatedProperty';
      const validatedPropertyValue: number = 10;
      const comparedProperty: string = 'comparedProperty';
      const validationArguments: ValidationArguments = {
        constraints: [comparedProperty],
        property: validatedProperty,
        object: {
          [validatedProperty]: validatedPropertyValue,
          [comparedProperty]: 10,
        },
      } as ValidationArguments;

      // Act
      const isValid: boolean = isGreaterOrEqualThanValidator.validate(validatedPropertyValue, validationArguments);

      // Assert
      expect(isValid).to.be.true;
    });

    it('should return false if property value is smaller than compared property', () => {
      // Arrange
      const validatedProperty: string = 'validatedProperty';
      const validatedPropertyValue: number = 10;
      const comparedProperty: string = 'comparedProperty';
      const validationArguments: ValidationArguments = {
        constraints: [comparedProperty],
        property: validatedProperty,
        object: {
          [validatedProperty]: validatedPropertyValue,
          [comparedProperty]: 20,
        },
      } as ValidationArguments;

      // Act
      const isValid: boolean = isGreaterOrEqualThanValidator.validate(validatedPropertyValue, validationArguments);

      // Assert
      expect(isValid).to.be.false;
    });
  });

  it('should return default message', () => {
    // Arrange
    const validationArguments: ValidationArguments = {
      constraints: ['comparedProperty'],
      property: 'validatedProperty',
    } as ValidationArguments;

    // Act
    const message: string = isGreaterOrEqualThanValidator.defaultMessage(validationArguments);

    // Assert
    expect(message).to.be.eql(
      `${validationArguments.property} should be greater or equal than ${validationArguments.constraints[0]}`
    );
  });
});
