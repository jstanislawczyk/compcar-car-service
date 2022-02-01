import {expect} from 'chai';
import {MatchProperty} from './match-property.decorator';

context('MatchProperty', () => {

  it('should return the function that registers the validator decorator', () => {
    // Arrange
    const propertyName: string = 'passwordRepeat';
    const matchProperty: string = 'password';
    const object: Record<string, string> = {
      [propertyName]: '1qazXSW@',
    };

    // Act
    const registeredDecorator: (object: any, propertyName: string) => void = MatchProperty(matchProperty);
    registeredDecorator(object, propertyName);

    // Assert
    expect(registeredDecorator).to.be.instanceOf(Function);
  });
});
