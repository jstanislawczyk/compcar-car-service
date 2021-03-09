import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {expect} from 'chai';
import {UserDatabaseUtils} from '../utils/database-utils/user/user.database-utils';
import {RegisterInput} from '../../src/inputs/user/register.input';
import {User} from '../../src/models/entities/user';
import {DateUtils} from '../utils/common/date.utils';
import {UserRole} from '../../src/enums/user-role';
import {UserBuilder} from '../utils/builders/user.builder';

describe('Security', () => {

  beforeEach(async () => {
    await UserDatabaseUtils.deleteAllUsers();
  });

  describe('register', () => {
    it('should fail validation', async () => {
      // Arrange
      const registerInput: RegisterInput = {
        email: 'wrong_mail',
        password: 'test',
        passwordRepeat: '123',
      } as RegisterInput;

      const query: string = `
        mutation {
          register (
            registerInput: {
              email: "${registerInput.email}",
              password: "${registerInput.password}",
              passwordRepeat: "${registerInput.passwordRepeat}"
            }
          ) {
            id,
            email,
            registerDate,
            activated,
            role
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const savedUsers: User[] = await UserDatabaseUtils.getAllUsers();
      expect(savedUsers).to.be.empty;

      const errorsBody: Record<string, any> = response.body.errors[0];
      expect(errorsBody.message).to.be.eql('Argument Validation Error');

      const errors: Record<string, any>[] = errorsBody.extensions.exception.validationErrors;
      expect(errors[0].property).to.be.eql('email');
      expect(errors[0].value).to.be.eql('wrong_mail');
      expect(errors[0].constraints.isEmail).to.be.eql('email must be an email');
      expect(errors[1].property).to.be.eql('password');
      expect(errors[1].value).to.be.eql('test');
      expect(errors[1].constraints.IsPassword).to.be.eql(
        'Password should contain minimum six characters, at least one uppercase letter, one lowercase letter and one number'
      );
      expect(errors[2].property).to.be.eql('passwordRepeat');
      expect(errors[2].value).to.be.eql('123');
      expect(errors[2].constraints.MatchProperty).to.be.eql(`"password" value doesn't match "passwordRepeat" property`);
    });

    describe('should register user', () => {
      it(`with role ${UserRole.ADMIN} set for first user registered`, async () => {
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
              passwordRepeat: "${registerInput.passwordRepeat}"
            }
          ) {
            id,
            email,
            registerDate,
            activated,
            role
          }
        }
      `;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({ query })
          .expect(200);

        const savedUsers: User[] = await UserDatabaseUtils.getAllUsers();
        expect(savedUsers).to.have.length(1);

        const returnedUserBody: User = response.body.data.register as User;
        expect(Number(returnedUserBody.id)).to.be.be.above(0);
        expect(returnedUserBody.email).to.be.eql('test@mail.com');
        expect(DateUtils.isISODate(returnedUserBody.registerDate)).to.be.true;
        expect(returnedUserBody.activated).to.be.true;
        expect(returnedUserBody.role).to.be.eql(UserRole.ADMIN);

        expect(savedUsers[0].id).to.be.be.eql(Number(returnedUserBody.id));
        expect(savedUsers[0].email).to.be.eql(returnedUserBody.email);
        expect(savedUsers[0].registerDate).to.be.eql(returnedUserBody.registerDate);
        expect(savedUsers[0].activated).to.be.eql(returnedUserBody.activated);
        expect(savedUsers[0].role).to.be.eql(returnedUserBody.role);
      });

      it(`with role ${UserRole.USER}`, async () => {
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
                passwordRepeat: "${registerInput.passwordRepeat}"
              }
            ) {
              id,
              email,
              registerDate,
              activated,
              role
            }
          }
        `;

        await UserDatabaseUtils.saveUser(new UserBuilder().build());

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({ query })
          .expect(200);

        const savedUsers: User[] = await UserDatabaseUtils.getAllUsers();
        expect(savedUsers).to.have.length(2);

        const returnedUserBody: User = response.body.data.register as User;
        expect(Number(returnedUserBody.id)).to.be.be.above(0);
        expect(returnedUserBody.email).to.be.eql('test@mail.com');
        expect(DateUtils.isISODate(returnedUserBody.registerDate)).to.be.true;
        expect(returnedUserBody.activated).to.be.true;
        expect(returnedUserBody.role).to.be.eql(UserRole.USER);
      });
    });
  });
});
