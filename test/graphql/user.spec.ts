import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {expect} from 'chai';
import {UserDatabaseUtils} from '../utils/database-utils/user.database-utils';
import {User} from '../../src/models/entities/user';
import {DateUtils} from '../utils/common/date.utils';
import {CommonDatabaseUtils} from '../utils/database-utils/common.database-utils';
import {UserBuilder} from '../utils/builders/user.builder';
import {UserRole} from '../../src/models/enums/user-role';
import {TokenUtils} from '../utils/common/token.utils';
import {ResponseError} from '../utils/interfaces/response-error';

describe('User', () => {

  before(async () =>
    await CommonDatabaseUtils.deleteAllEntities()
  );

  beforeEach(async () =>
    await UserDatabaseUtils.deleteAllUsers()
  );

  describe('getUsers', () => {
    it('should get users', async () => {
      // Arrange
      const usersList: User[] = [
        new UserBuilder().build(),
        new UserBuilder()
          .withEmail('second@mail.com')
          .withPassword('2wsxCDE#')
          .withRole(UserRole.ADMIN)
          .build(),
      ];
      const query: string = `
        {
          getUsers {
            id,
            email,
            password,
            role,
            registerDate,
            activated,
          }
        }
      `;

      await UserDatabaseUtils.saveUsersList(usersList);

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .set('Authorization', TokenUtils.getAuthToken(UserRole.ADMIN))
        .send({ query })
        .expect(200);

      const returnedUsers: User[] = response.body.data.getUsers as User[];
      expect(returnedUsers).to.have.length(2);

      expect(Number(returnedUsers[0].id)).to.be.be.above(0);
      expect(returnedUsers[0].email).to.be.be.eql('test@user.com');
      expect(returnedUsers[0].password).to.be.be.eql('1qazXSW@');
      expect(DateUtils.isISODate(returnedUsers[0].registerDate)).to.be.be.true;
      expect(returnedUsers[0].activated).to.be.be.true;
      expect(returnedUsers[0].role).to.be.be.eql(UserRole.USER);
      expect(Number(returnedUsers[1].id)).to.be.be.above(0);
      expect(returnedUsers[1].email).to.be.be.eql('second@mail.com');
      expect(returnedUsers[1].password).to.be.be.eql('2wsxCDE#');
      expect(DateUtils.isISODate(returnedUsers[1].registerDate)).to.be.be.true;
      expect(returnedUsers[1].activated).to.be.be.true;
      expect(returnedUsers[1].role).to.be.be.eql(UserRole.ADMIN);

      const existingUsers: User[] = await UserDatabaseUtils.getAllUsers();
      expect(existingUsers).to.have.length(2);

      expect(returnedUsers[0].id).to.be.be.eql(existingUsers[0].id?.toString());
      expect(returnedUsers[0].registerDate).to.be.be.eql(existingUsers[0].registerDate);
      expect(returnedUsers[0].email).to.be.be.eql(existingUsers[0].email);
      expect(returnedUsers[0].password).to.be.be.eql(existingUsers[0].password);
      expect(returnedUsers[0].activated).to.be.be.eql(existingUsers[0].activated);
      expect(returnedUsers[0].role).to.be.be.eql(existingUsers[0].role);
      expect(returnedUsers[1].id).to.be.be.eql(existingUsers[1].id?.toString());
      expect(returnedUsers[1].registerDate).to.be.be.eql(existingUsers[1].registerDate);
      expect(returnedUsers[1].email).to.be.be.eql(existingUsers[1].email);
      expect(returnedUsers[1].password).to.be.be.eql(existingUsers[1].password);
      expect(returnedUsers[1].activated).to.be.be.eql(existingUsers[1].activated);
      expect(returnedUsers[1].role).to.be.be.eql(existingUsers[1].role);
    });

    describe('should throw error', () => {
      it("if token isn't provided", async () => {
        // Arrange
        const query: string = `
          {
            getUsers {
              id,
            }
          }
        `;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({ query })
          .expect(200);

        const error: ResponseError = response.body.errors[0];
        expect(error.message).to.be.eql('jwt must be provided');
        expect(error.extensions.code).to.be.eql('INVALID_TOKEN');
      });

      it("if token isn't provided", async () => {
        // Arrange
        const role: UserRole = UserRole.USER;
        const query: string = `
          {
            getUsers {
              id,
            }
          }
        `;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .set('Authorization', TokenUtils.getAuthToken(role))
          .send({ query })
          .expect(200);

        const error: ResponseError = response.body.errors[0];
        expect(error.message).to.be.eql(`User with role=${role} is not allowed to perform this action`);
        expect(error.extensions.code).to.be.eql('INVALID_TOKEN');
      });
    });
  });
});
