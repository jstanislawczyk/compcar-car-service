import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStub} from 'sinon';
import {MatchProperty} from './match-property.decorator';
import * as classValidator from 'class-validator';
import sinonChai from 'sinon-chai';
import {MatchPropertyValidator} from '../../validators/match-property.validator';

use(sinonChai);

context('MatchProperty', () => {

  let sandbox: SinonSandbox;
  let registerDecoratorStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    registerDecoratorStub = sandbox.stub(classValidator, 'registerDecorator');
  });

  afterEach(() => {
    sandbox.restore();
  });

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
    expect(registerDecoratorStub).to.be.calledOnceWith({
      name: 'MatchProperty',
      propertyName,
      constraints: [matchProperty],
      validator: MatchPropertyValidator,
      target: object.constructor,
    });
  });
});
