import {expect} from 'chai';
import {IsPassword} from './is-password.decorator';

context('IsPassword', () => {

  it('should return the function that registers the validator decorator', () => {
    // Arrange
    const propertyName: string = 'password';
    const object: Record<string, string> = {
      [propertyName]: '1qazXSW@',
    };

    // Act
    const registeredDecorator: (object: any, propertyName: string) => void = IsPassword();
    registeredDecorator(object, propertyName);

    // Assert
    expect(registeredDecorator).to.be.instanceOf(Function);
  });
});
