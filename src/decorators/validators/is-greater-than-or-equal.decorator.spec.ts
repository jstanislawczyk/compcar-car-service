import {expect} from 'chai';
import {IsGreaterThanOrEqual} from './is-greater-than-or-equal.decorator';

context('IsGreaterThanOrEqual', () => {

  it('should return the function that registers the validator decorator', () => {
    // Arrange
    const validatedPropertyName: string = 'firstProperty';
    const comparedPropertyName: string = 'secondProperty';
    const object: Record<string, number> = {
      [validatedPropertyName]: 2000,
      [comparedPropertyName]: 1900,
    };

    // Act
    const registeredDecorator: (object: any, propertyName: string) => void = IsGreaterThanOrEqual(comparedPropertyName);
    registeredDecorator(object, validatedPropertyName);

    // Assert
    expect(registeredDecorator).to.be.instanceOf(Function);
  });
});
