import sinon, {SinonSandbox} from 'sinon';
import {CommonDatabaseUtils} from '../utils/database-utils/common.database-utils';
import {UserDatabaseUtils} from '../utils/database-utils/user.database-utils';
import {UserRole} from '../../src/models/enums/user-role';
import {RegisterInput} from '../../src/models/inputs/user/register.input';
import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {User} from '../../src/models/entities/user';
import {expect} from 'chai';
import {StringUtils} from '../utils/common/string.utils';
import {DateUtils} from '../utils/common/date.utils';
import axios from 'axios';
import config from 'config';

describe('User', () => {

  const emailHost: string = config.get('email.host');
  const emailPort: number = config.get('email.port.http');

  let sandbox: SinonSandbox;

  before(async () =>
    await CommonDatabaseUtils.deleteAllEntities()
  );

  beforeEach(async () => {
    await UserDatabaseUtils.deleteAllUsers();
    await axios.delete(`http://${emailHost}:${emailPort}/api/v1/messages`);

    sandbox = sinon.createSandbox();
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('register', () => {
    it(`with role ${UserRole.ADMIN} set for first registered user`, async () => {
      // Arrange
      const registerInput: RegisterInput = {
        email: 'test@mail.com',
        password: '1qazXSW@',
        passwordRepeat: '1qazXSW@',
      } as RegisterInput;

      const query: string = `
        mutation {
          register (
            registerInput: {
              email: "${registerInput.email}",
              password: "${registerInput.password}",
              passwordRepeat: "${registerInput.passwordRepeat}",
            }
          ) {
            id,
            email,
            password,
            registerDate,
            activated,
            role,
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({query})
        .expect(200);

      const returnedUserBody: User = response.body.data.register as User;
      expect(Number(returnedUserBody.id)).to.be.above(0);
      expect(returnedUserBody.email).to.be.eql('test@mail.com');
      expect(StringUtils.isBcryptPassword(returnedUserBody.password)).to.be.true;
      expect(DateUtils.isISODate(returnedUserBody.registerDate)).to.be.true;
      expect(returnedUserBody.activated).to.be.false;
      expect(returnedUserBody.role).to.be.eql(UserRole.ADMIN);

      const savedUser: User = await UserDatabaseUtils.getUserByIdOrFail(
        Number(returnedUserBody.id),
        {
          relations: ['registrationConfirmation'],
        }
      );

      expect(savedUser.id).to.be.eql(Number(returnedUserBody.id));
      expect(savedUser.email).to.be.eql(returnedUserBody.email);
      expect(savedUser.password).to.be.eql(returnedUserBody.password);
      expect(savedUser.registerDate).to.be.eql(returnedUserBody.registerDate);
      expect(savedUser.activated).to.be.eql(returnedUserBody.activated);
      expect(savedUser.role).to.be.eql(returnedUserBody.role);

      const mailhogResponse: Record<string, any> = await axios.get(`http://${emailHost}:${emailPort}/api/v2/messages`);
      const mailhogMessages: Record<string, any> = mailhogResponse.data.items;
      expect(mailhogMessages).to.be.an('array').length(1);

      const registrationMessage: Record<string, any> = mailhogMessages[0];
      expect(registrationMessage.Raw.From).to.be.eql(config.get('email.auth.user'));
      expect(registrationMessage.Raw.To).to.be.eql([registerInput.email]);
      expect(registrationMessage.Content.Body).to.be
        .a('string')
        .and.include(savedUser.registrationConfirmation?.code);
    });
  });
});
