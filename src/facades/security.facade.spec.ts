import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {UserService} from '../services/user.service';
import {SecurityFacade} from './security.facade';
import {TokenService} from '../services/token.service';
import {User} from '../models/entities/user';
import {LoginCredentials} from '../models/common/security/login-credentials';
import {AuthenticationError} from 'apollo-server';
import {UserBuilder} from '../../test/utils/builders/user.builder';
import {EmailService} from '../services/email.service';
import {RegistrationConfirmationEmail} from '../models/common/email/registration-confirmation.email';

use(sinonChai);
use(chaiAsPromised);

context('SecurityFacade', () => {

  let sandbox: SinonSandbox;
  let userServiceStub: SinonStubbedInstance<UserService>;
  let tokenServiceStub: SinonStubbedInstance<TokenService>;
  let emailServiceStub: SinonStubbedInstance<EmailService>;
  let securityFacade: SecurityFacade;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    userServiceStub = sandbox.createStubInstance(UserService);
    tokenServiceStub = sandbox.createStubInstance(TokenService);
    emailServiceStub = sandbox.createStubInstance(EmailService);

    emailServiceStub.sendMail.resolves();

    securityFacade = new SecurityFacade(userServiceStub, tokenServiceStub, emailServiceStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('authorizeUser', () => {
    it('should return token', async () => {
      // Arrange
      const loginCredentials: LoginCredentials = {
        email: 'test@mail.com',
        password: '1qazXSW@',
      };
      const existingUser: User = new UserBuilder().build();
      const generatedToken: string = 'TestToken';

      userServiceStub.findOneByEmail.resolves(existingUser);
      tokenServiceStub.getUserToken.resolves(generatedToken);

      // Act
      const authenticationToken: string = await securityFacade.authorizeUser(loginCredentials);

      // Assert
      expect(authenticationToken).to.be.eql(generatedToken);
      expect(userServiceStub.findOneByEmail).to.be.calledOnceWith(loginCredentials.email);
      expect(tokenServiceStub.getUserToken).to.be.calledOnceWith(loginCredentials, existingUser);
    });

    it('should throw error if user is not found', async () => {
      // Arrange
      const loginCredentials: LoginCredentials = {
        email: 'test@mail.com',
        password: '1qazXSW@',
      };

      userServiceStub.findOneByEmail.rejects(new Error('UserNotFound Error'));

      // Act
      const authenticationTokenResult: Promise<string> = securityFacade.authorizeUser(loginCredentials);

      // Assert
      await expect(authenticationTokenResult).to.eventually
        .be.rejectedWith('Authentication data are not valid')
        .and.be.an.instanceOf(AuthenticationError);
      expect(userServiceStub.findOneByEmail).to.be.calledOnceWith(loginCredentials.email);
      expect(tokenServiceStub.getUserToken).to.be.not.called;
    });

    it('should throw error if getUserToken fails', async () => {
      // Arrange
      const loginCredentials: LoginCredentials = {
        email: 'test@mail.com',
        password: '1qazXSW@',
      };

      userServiceStub.findOneByEmail.resolves(new UserBuilder().build());
      tokenServiceStub.getUserToken.throws('TokenService Error');

      // Act
      const authenticationTokenResult: Promise<string> = securityFacade.authorizeUser(loginCredentials);

      // Assert
      await expect(authenticationTokenResult).to.eventually
        .be.rejectedWith('Authentication data are not valid')
        .and.be.an.instanceOf(AuthenticationError);
    });
  });

  describe('registerUser', () => {
    it('should register user', async () => {
      // Arrange
      const userToSave: User = new UserBuilder().build();

      userServiceStub.saveUser.resolves(new UserBuilder(true).build());

      // Act
      const savedUser: User = await securityFacade.registerUser(userToSave);

      // Assert
      expect(savedUser).to.be.eql(new UserBuilder(true).build());
      expect(userServiceStub.saveUser).to.be.calledOnceWith(userToSave);
      expect(emailServiceStub.sendMail).to.be.calledOnceWith(new RegistrationConfirmationEmail(savedUser));
    });

    describe('should throw error', () => {
      it('from saveUser method', async () => {
        // Arrange
        userServiceStub.saveUser.rejects(new Error('RegisterUser error'));

        // Act
        const userRegisterResult: Promise<User> = securityFacade.registerUser(new UserBuilder().build());

        // Assert
        await expect(userRegisterResult).to.eventually.be.rejectedWith('RegisterUser error');
        expect(userServiceStub.saveUser).to.be.calledOnce;
        expect(emailServiceStub.sendMail).to.be.not.called;
      });

      it('from sendMail method', async () => {
        // Arrange
        const userToSave: User = new UserBuilder().build();

        userServiceStub.saveUser.resolves(userToSave);
        emailServiceStub.sendMail.rejects(new Error('EmailSend error'));

        // Act
        const userRegisterResult: Promise<User> = securityFacade.registerUser(userToSave);

        // Assert
        await expect(userRegisterResult).to.eventually.be.rejectedWith('EmailSend error');
        expect(userServiceStub.saveUser).to.be.calledOnce;
        expect(emailServiceStub.sendMail).to.be.calledOnce;
      });
    });
  });
});
