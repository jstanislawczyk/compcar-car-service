import {UserRepository} from '../repositories/user.repository';
import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {UserBuilder} from '../../test/utils/builders/user.builder';
import {HealthService} from './health.service';
import {HealthStatus} from '../enums/health-status';
import {ApplicationHealth} from '../models/object-types/health/application-health';

use(sinonChai);
use(chaiAsPromised);

context('HealthService', () => {

  let sandbox: SinonSandbox;
  let userRepositoryStub: SinonStubbedInstance<UserRepository>;
  let healthService: HealthService;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    userRepositoryStub = sandbox.createStubInstance(UserRepository);
    healthService = new HealthService(userRepositoryStub);

    userRepositoryStub.findOne.resolves(new UserBuilder().build());
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('getApplicationHealth', () => {
    it(`should get ${HealthStatus.OK} status if all services and databases work`, async () => {
      // Arrange
      userRepositoryStub.findOne.resolves(new UserBuilder().build());

      // Act
      const applicationHealth: ApplicationHealth = await healthService.getApplicationHealth();

      // Assert
      expect(applicationHealth.generalStatus).to.be.eql(HealthStatus.OK);
      expect(applicationHealth.healthDetails.database.mysql).to.be.eql(HealthStatus.OK);
    });

    it(`should get ${HealthStatus.CRITICAL} status if mysql database is not working`, async () => {
      // Arrange
      userRepositoryStub.findOne.rejects(new Error('FindOne error'));

      // Act
      const applicationHealth: ApplicationHealth = await healthService.getApplicationHealth();

      // Assert
      expect(applicationHealth.generalStatus).to.be.eql(HealthStatus.CRITICAL);
      expect(applicationHealth.healthDetails.database.mysql).to.be.eql(HealthStatus.CRITICAL);
    });
  });
});
