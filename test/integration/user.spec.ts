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

describe('User', () => {

  let sandbox: SinonSandbox;

  before(async () =>
    await CommonDatabaseUtils.deleteAllEntities()
  );

  beforeEach(async () => {
    await UserDatabaseUtils.deleteAllUsers();

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
      expect(returnedUserBody.activated).to.be.true;
      expect(returnedUserBody.role).to.be.eql(UserRole.ADMIN);

      const savedUsers: User[] = await UserDatabaseUtils.getAllUsers();
      expect(savedUsers).to.be.an('array').length(1);

      expect(savedUsers[0].id).to.be.eql(Number(returnedUserBody.id));
      expect(savedUsers[0].email).to.be.eql(returnedUserBody.email);
      expect(savedUsers[0].password).to.be.eql(returnedUserBody.password);
      expect(savedUsers[0].registerDate).to.be.eql(returnedUserBody.registerDate);
      expect(savedUsers[0].activated).to.be.eql(returnedUserBody.activated);
      expect(savedUsers[0].role).to.be.eql(returnedUserBody.role);
    });
  });
});
