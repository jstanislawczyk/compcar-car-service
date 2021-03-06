import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStub} from 'sinon';
import {IsPassword} from './is-password.decorator';
import {IsPasswordValidator} from '../../validators/is-password.validator';
import * as classValidator from 'class-validator';
import sinonChai from 'sinon-chai';

use(sinonChai);

context('IsPassword', () => {

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
    const propertyName: string = 'password';
    const object: Record<string, string> = {
      [propertyName]: '1qazXSW@',
    };

    // Act
    const registeredDecorator: (object: any, propertyName: string) => void = IsPassword();
    registeredDecorator(object, propertyName);

    // Assert
    expect(registeredDecorator).to.be.instanceOf(Function);
    expect(registerDecoratorStub).to.be.calledOnceWith({
      name: 'IsPassword',
      propertyName,
      validator: IsPasswordValidator,
      target: object.constructor,
    });
  });
});
