import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {expect} from 'chai';
import {UserDatabaseUtils} from '../utils/database-utils/user.database-utils';
import {CommonDatabaseUtils} from '../utils/database-utils/common.database-utils';
import {UserBuilder} from '../utils/builders/user.builder';
import {ApplicationHealth} from '../../src/models/types/health/application-health';
import {HealthStatus} from '../../src/enums/health-status';
import {UserRepository} from '../../src/repositories/user.repository';
import sinon from 'sinon';

describe('Health', () => {

  before(async () => {
    await CommonDatabaseUtils.deleteAllEntities();
  });

  beforeEach(async () => {
    await UserDatabaseUtils.deleteAllUsers();
  });

  after(() => {
    sinon.restore();
  });

  describe('getApplicationHealth', () => {
    describe(`should get ${HealthStatus.OK} status`, () => {
      it('if database contains entity', async () => {
        // Arrange
        const query: string = `
          {
            getApplicationHealth {
              generalStatus,
              healthDetails {
                database {
                  mysql,
                }
              }
            }
          }
        `;

        await UserDatabaseUtils.saveUser(new UserBuilder().build());

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({ query })
          .expect(200);

        const returnedApplicationHealth: ApplicationHealth = response.body.data.getApplicationHealth as ApplicationHealth;
        expect(returnedApplicationHealth.generalStatus).to.be.eql(HealthStatus.OK);
        expect(returnedApplicationHealth.healthDetails.database.mysql).to.be.eql(HealthStatus.OK);
      });

      it('if database is empty', async () => {
        // Arrange
        const query: string = `
          {
            getApplicationHealth {
              generalStatus,
              healthDetails {
                database {
                  mysql,
                }
              }
            }
          }
        `;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({ query })
          .expect(200);

        const returnedApplicationHealth: ApplicationHealth = response.body.data.getApplicationHealth as ApplicationHealth;
        expect(returnedApplicationHealth.generalStatus).to.be.eql(HealthStatus.OK);
        expect(returnedApplicationHealth.healthDetails.database.mysql).to.be.eql(HealthStatus.OK);
      });
    });

    describe(`should get ${HealthStatus.CRITICAL} status`, () => {
      it('if database entity fetch fails', async () => {
        // Arrange
        const query: string = `
          {
            getApplicationHealth {
              generalStatus,
              healthDetails {
                database {
                  mysql,
                }
              }
            }
          }
        `;

        sinon.stub(UserRepository.prototype, 'findOne').rejects(new Error('FindOne error'));

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({ query })
          .expect(200);

        const returnedApplicationHealth: ApplicationHealth = response.body.data.getApplicationHealth as ApplicationHealth;
        expect(returnedApplicationHealth.generalStatus).to.be.eql(HealthStatus.CRITICAL);
        expect(returnedApplicationHealth.healthDetails.database.mysql).to.be.eql(HealthStatus.CRITICAL);
      });
    });
  });
});
