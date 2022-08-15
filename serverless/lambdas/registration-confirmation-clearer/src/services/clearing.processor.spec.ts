import sinonChai from 'sinon-chai';
import {expect, use} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {RegistrationConfirmationService} from './registration-confirmation.service';
import {createSandbox, SinonSandbox, SinonStubbedInstance} from 'sinon';
import {ClearingProcessor} from './clearing.processor';

use(sinonChai);
use(chaiAsPromised);

describe('ClearingProcessor', () => {

  let sandbox: SinonSandbox;
  let registrationConfirmationServiceStub: SinonStubbedInstance<RegistrationConfirmationService>;
  let clearingProcessor: ClearingProcessor;

  beforeEach(() => {
    sandbox = createSandbox();

    registrationConfirmationServiceStub = sandbox.createStubInstance(RegistrationConfirmationService);

    clearingProcessor = new ClearingProcessor(registrationConfirmationServiceStub);
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('clear', () => {
    it('should clear outdated registration confirmations', async () => {
      // Arrange
      registrationConfirmationServiceStub.deleteOutdatedRegistrationConfirmations.resolves({
        affected: 1,
        raw: {},
      });

      // Act
      await clearingProcessor.clear();

      // Assert
      expect(registrationConfirmationServiceStub.deleteOutdatedRegistrationConfirmations).to.be.calledOnce;
    });

    it('should throw error from RegistrationConfirmationService deleteOutdatedRegistrationConfirmations method', async () => {
      // Arrange
      const errorMessage: string = 'Delete error';

      registrationConfirmationServiceStub.deleteOutdatedRegistrationConfirmations.rejects(new Error(errorMessage));

      // Act
      const result: Promise<void> = clearingProcessor.clear();

      // Assert
      await expect(result).to.eventually
        .be.rejectedWith(errorMessage)
        .and.to.be.an.instanceOf(Error);
      expect(registrationConfirmationServiceStub.deleteOutdatedRegistrationConfirmations).to.be.calledOnce;
    });
  });
});
