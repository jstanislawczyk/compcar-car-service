import {expect, use} from 'chai';
import sinon, {SinonSandbox} from 'sinon';
import sinonChai from 'sinon-chai';
import {MatchPropertyValidator} from './match-property.validator';
import {ValidationArguments} from 'class-validator';

use(sinonChai);

context('MatchProperty', () => {

  let sandbox: SinonSandbox;
  let matchPropertyValidator: MatchPropertyValidator;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    matchPropertyValidator = new MatchPropertyValidator();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('validate', () => {
    it('should validate equal values', () => {
      // Arrange
      const repeatPassword: string = '1qazXSW@';
      const validationArguments: ValidationArguments = {
        constraints: ['password'],
        property: 'passwordRepeat',
        object: {
          password: repeatPassword,
          repeatPassword,
        },
      } as unknown as ValidationArguments;

      // Act
      const isValid: boolean = matchPropertyValidator.validate(repeatPassword, validationArguments);

      // Assert
      expect(isValid).to.be.true;
    });

    it('should return false if compared values are different', () => {
      // Arrange
      const password: string = '1qazXSW@';
      const repeatPassword: string = 'Test123@';
      const validationArguments: ValidationArguments = {
        constraints: ['password'],
        property: 'passwordRepeat',
        object: {
          password,
          repeatPassword,
        },
      } as unknown as ValidationArguments;

      // Act
      const isValid: boolean = matchPropertyValidator.validate(repeatPassword, validationArguments);

      // Assert
      expect(isValid).to.be.false;
    });
  });

  it('should return default message', () => {
    // Arrange
    const validationArguments: ValidationArguments = {
      constraints: ['password'],
      property: 'passwordRepeat',
    } as ValidationArguments;

    // Act
    const message: string = matchPropertyValidator.defaultMessage(validationArguments);

    // Assert
    expect(message).to.be.eql(
      `"${validationArguments.constraints[0]}" value doesn't match "${validationArguments.property}" property`
    );
  });
});
