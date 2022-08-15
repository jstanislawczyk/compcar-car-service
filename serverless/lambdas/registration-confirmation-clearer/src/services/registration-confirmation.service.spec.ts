import sinonChai from 'sinon-chai';
import {expect, use} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {RegistrationConfirmationService} from './registration-confirmation.service';
import {createSandbox, SinonSandbox, SinonStubbedInstance} from 'sinon';
import {DeleteResult, LessThan, Repository} from 'typeorm';
import {RegistrationConfirmation} from '../models/entities/registration-confirmation';

use(sinonChai);
use(chaiAsPromised);

describe('RegistrationConfirmationService', () => {

  let sandbox: SinonSandbox;
  let registrationConfirmationRepositoryStub: SinonStubbedInstance<Repository<RegistrationConfirmation>>;
  let registrationConfirmationService: RegistrationConfirmationService;

  beforeEach(() => {
    sandbox = createSandbox();

    registrationConfirmationRepositoryStub = sandbox.createStubInstance(Repository<RegistrationConfirmation>);

    registrationConfirmationService = new RegistrationConfirmationService(registrationConfirmationRepositoryStub);
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('deleteOutdatedRegistrationConfirmations', () => {
    it('should delete outdated registration confirmations', async () => {
      // Arrange
      const now: Date = new Date();

      sandbox.useFakeTimers(now);
      registrationConfirmationRepositoryStub.delete.resolves({
        affected: 1,
        raw: {},
      });

      // Act
      const deleteResult: DeleteResult = await registrationConfirmationService.deleteOutdatedRegistrationConfirmations();

      // Assert
      expect(deleteResult).to.be.eql({
        affected: 1,
        raw: {},
      });
      expect(registrationConfirmationRepositoryStub.delete).to.be.calledOnceWith({
        allowedConfirmationDate: LessThan(now.toISOString()),
      });
    });

    it('should throw error from RegistrationConfirmation delete method', async () => {
      // Arrange
      const errorMessage: string = 'Delete error';

      registrationConfirmationRepositoryStub.delete.rejects(new Error(errorMessage));

      // Act
      const deleteResult: Promise<DeleteResult> = registrationConfirmationService.deleteOutdatedRegistrationConfirmations();

      // Assert
      await expect(deleteResult).to.eventually
        .be.rejectedWith(errorMessage)
        .and.to.be.an.instanceOf(Error);
      expect(registrationConfirmationRepositoryStub.delete).to.be.calledOnce;
    });
  });
});
