import {expect, use} from 'chai';
import sinon, {SinonSandbox} from 'sinon';
import sinonChai from 'sinon-chai';
import {IsPasswordValidator} from './is-password.validator';

use(sinonChai);

context('IsPasswordValidator', () => {

  let sandbox: SinonSandbox;
  let passwordValidator: IsPasswordValidator;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    passwordValidator = new IsPasswordValidator();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('validate', () => {
    it('should validate password', () => {
      // Arrange
      const validPassword: string = '1qazXSW@';

      // Act
      const isValid: boolean = passwordValidator.validate(validPassword);

      // Assert
      expect(isValid).to.be.true;
    });

    it('should return false for password with letters only', () => {
      // Arrange
      const validPassword: string = 'qwertyuio';

      // Act
      const isValid: boolean = passwordValidator.validate(validPassword);

      // Assert
      expect(isValid).to.be.false;
    });

    it('should return false for password with numbers only', () => {
      // Arrange
      const validPassword: string = '123456789';

      // Act
      const isValid: boolean = passwordValidator.validate(validPassword);

      // Assert
      expect(isValid).to.be.false;
    });

    it('should return false for password with special characters only', () => {
      // Arrange
      const validPassword: string = '!@#$%^&*(';

      // Act
      const isValid: boolean = passwordValidator.validate(validPassword);

      // Assert
      expect(isValid).to.be.false;
    });

    it('should return false for password with letters and special characters only', () => {
      // Arrange
      const validPassword: string = 'qazxsw^&*(';

      // Act
      const isValid: boolean = passwordValidator.validate(validPassword);

      // Assert
      expect(isValid).to.be.false;
    });

    it('should return false for password with letters and numbers only', () => {
      // Arrange
      const validPassword: string = '1234qazxsw';

      // Act
      const isValid: boolean = passwordValidator.validate(validPassword);

      // Assert
      expect(isValid).to.be.false;
    });

    it('should return false for password with special characters and numbers only', () => {
      // Arrange
      const validPassword: string = '!@#$qazxsw';

      // Act
      const isValid: boolean = passwordValidator.validate(validPassword);

      // Assert
      expect(isValid).to.be.false;
    });

    it('should return false for password with 5 characters', () => {
      // Arrange
      const validPassword: string = '1qXS@';

      // Act
      const isValid: boolean = passwordValidator.validate(validPassword);

      // Assert
      expect(isValid).to.be.false;
    });
  });

  it('should return default message', () => {
    // Act
    const message: string = passwordValidator.defaultMessage();

    // Assert
    expect(message).to.be.eql(
      'Password should contain minimum six characters, at least one uppercase letter, one lowercase letter and one number'
    );
  });
});
