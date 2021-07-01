import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {HealthService} from '../services/health.service';
import {HealthResolver} from './health.resolver';
import {HealthStatus} from '../enums/health-status';
import {ApplicationHealth} from '../models/object-types/health/application-health';

use(sinonChai);
use(chaiAsPromised);

context('HealthResolver', () => {

  let sandbox: SinonSandbox;
  let healthServiceStub: SinonStubbedInstance<HealthService>;
  let healthResolver: HealthResolver;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    healthServiceStub = sandbox.createStubInstance(HealthService);

    healthResolver = new HealthResolver(healthServiceStub as unknown as HealthService);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getApplicationHealth', () => {
    it(`should return ${HealthStatus.OK} status`, async () => {
      // Arrange
      const returnedApplicationHealth: ApplicationHealth = {
        generalStatus: HealthStatus.OK,
        healthDetails: {
          database: {
            mysql: HealthStatus.OK,
          },
        },
      };

      healthServiceStub.getApplicationHealth.resolves(returnedApplicationHealth);

      // Act
      const applicationHealth: ApplicationHealth = await healthResolver.getApplicationHealth();

      // Assert
      expect(applicationHealth.generalStatus).to.be.eql(HealthStatus.OK);
      expect(applicationHealth.healthDetails.database.mysql).to.be.eql(HealthStatus.OK);
    });

    it(`should return ${HealthStatus.CRITICAL} status`, async () => {
      // Arrange
      const returnedApplicationHealth: ApplicationHealth = {
        generalStatus: HealthStatus.CRITICAL,
        healthDetails: {
          database: {
            mysql: HealthStatus.CRITICAL,
          },
        },
      };

      healthServiceStub.getApplicationHealth.resolves(returnedApplicationHealth);

      // Act
      const applicationHealth: ApplicationHealth = await healthResolver.getApplicationHealth();

      // Assert
      expect(applicationHealth.generalStatus).to.be.eql(HealthStatus.CRITICAL);
      expect(applicationHealth.healthDetails.database.mysql).to.be.eql(HealthStatus.CRITICAL);
    });
  });
});
