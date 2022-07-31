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
import {RegistrationConfirmationBuilder} from '../../test/utils/builders/registration-confirmation.builder';
import {RegistrationConfirmation} from '../models/entities/registration-confirmation';
import {InactiveAccountError} from '../models/errors/inactive-account.error';
import {v4} from 'uuid';

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

  afterEach(() =>
    sandbox.restore()
  );

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

      userServiceStub.findOneByEmail.resolves();

      // Act
      const authenticationTokenResult: Promise<string> = securityFacade.authorizeUser(loginCredentials);

      // Assert
      await expect(authenticationTokenResult).to.eventually
        .be.rejectedWith('Credentials are incorrect')
        .and.be.an.instanceOf(AuthenticationError);
      expect(userServiceStub.findOneByEmail).to.be.calledOnceWith(loginCredentials.email);
      expect(tokenServiceStub.getUserToken).to.be.not.called;
    });

    it('should throw error if user finding fails', async () => {
      // Arrange
      const errorMessage: string = 'UserNotFound Error';
      const loginCredentials: LoginCredentials = {
        email: 'test@mail.com',
        password: '1qazXSW@',
      };

      userServiceStub.findOneByEmail.rejects(new Error(errorMessage));

      // Act
      const authenticationTokenResult: Promise<string> = securityFacade.authorizeUser(loginCredentials);

      // Assert
      await expect(authenticationTokenResult).to.eventually
        .be.rejectedWith(errorMessage)
        .and.be.an.instanceOf(Error);
      expect(userServiceStub.findOneByEmail).to.be.calledOnceWith(loginCredentials.email);
      expect(tokenServiceStub.getUserToken).to.be.not.called;
    });

    it('should throw error if user is inactive', async () => {
      // Arrange
      const loginCredentials: LoginCredentials = {
        email: 'test@mail.com',
        password: '1qazXSW@',
      };
      const existingUser: User = new UserBuilder()
        .withActivated(false)
        .build();

      userServiceStub.findOneByEmail.resolves(existingUser);

      // Act
      const authenticationTokenResult: Promise<string> = securityFacade.authorizeUser(loginCredentials);

      // Assert
      await expect(authenticationTokenResult).to.eventually
        .be.rejectedWith('User account is inactive. Please confirm email')
        .and.be.an.instanceOf(InactiveAccountError);
      expect(userServiceStub.findOneByEmail).to.be.calledOnceWith(loginCredentials.email);
      expect(tokenServiceStub.getUserToken).to.be.not.called;
    });

    it('should throw error if getUserToken fails', async () => {
      // Arrange
      const errorMessage: string = 'TokenService Error';
      const loginCredentials: LoginCredentials = {
        email: 'test@mail.com',
        password: '1qazXSW@',
      };

      userServiceStub.findOneByEmail.resolves(new UserBuilder().build());
      tokenServiceStub.getUserToken.throws(new Error(errorMessage));

      // Act
      const authenticationTokenResult: Promise<string> = securityFacade.authorizeUser(loginCredentials);

      // Assert
      await expect(authenticationTokenResult).to.eventually
        .be.rejectedWith(errorMessage)
        .and.be.an.instanceOf(Error);
    });
  });

  describe('registerUser', () => {
    it('should register user', async () => {
      // Arrange
      const userToSave: User = new UserBuilder().build();
      const savedUser: User = new UserBuilder(true).build();
      const registrationConfirmationToSave: RegistrationConfirmation = new RegistrationConfirmationBuilder().build();

      userServiceStub.saveUser.resolves(savedUser);
      userServiceStub.createUserRegistrationConfirmation.resolves(registrationConfirmationToSave);

      // Act
      const registeredUser: User = await securityFacade.registerUser(userToSave);

      // Assert
      expect(registeredUser).to.be.eql(savedUser);
      expect(userServiceStub.saveUser).to.be.calledOnceWith(userToSave);
      expect(userServiceStub.createUserRegistrationConfirmation).to.be.calledOnceWith(savedUser);
      expect(emailServiceStub.sendMail).to.be.calledOnceWith(
        new RegistrationConfirmationEmail(registeredUser, registrationConfirmationToSave)
      );
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
        expect(userServiceStub.createUserRegistrationConfirmation).to.not.be.called;
        expect(emailServiceStub.sendMail).to.not.be.called;
      });

      it('from createUserRegistrationConfirmation method', async () => {
        // Arrange
        const userToSave: User = new UserBuilder().build();
        const savedUser: User = new UserBuilder(true).build();
        const errorMessage: string = 'RegistrationConfirmation Error';

        userServiceStub.saveUser.resolves(savedUser);
        userServiceStub.createUserRegistrationConfirmation.rejects(new Error(errorMessage));

        // Act
        const userRegisterResult: Promise<User> = securityFacade.registerUser(userToSave);

        // Assert
        await expect(userRegisterResult).to.eventually
          .be.rejectedWith(errorMessage)
          .and.be.instanceOf(Error);
        expect(userServiceStub.saveUser).to.be.calledOnce;
        expect(userServiceStub.createUserRegistrationConfirmation).to.be.calledOnce;
        expect(emailServiceStub.sendMail).to.not.be.called;
      });

      it('from sendMail method', async () => {
        // Arrange
        const userToSave: User = new UserBuilder().build();
        const savedUser: User = new UserBuilder(true).build();
        const registrationConfirmationToSave: RegistrationConfirmation = new RegistrationConfirmationBuilder().build();

        userServiceStub.saveUser.resolves(savedUser);
        userServiceStub.createUserRegistrationConfirmation.resolves(registrationConfirmationToSave);
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

  describe('activateUser', () => {
    it('should activate user', async () => {
      // Arrange
      const confirmationCode: string = v4();
      const registrationConfirmation: RegistrationConfirmation = new RegistrationConfirmationBuilder()
        .withCode(confirmationCode)
        .withConfirmedAt(new Date().toISOString())
        .build();

      userServiceStub.activateUser.resolves(registrationConfirmation);

      // Act
      const returnedRegistrationConfirmation: RegistrationConfirmation = await securityFacade.activateUser(confirmationCode);

      // Assert
      expect(returnedRegistrationConfirmation).to.be.eql(registrationConfirmation);
      expect(userServiceStub.activateUser).to.be.calledOnceWith(confirmationCode);
    });

    it('should rethrow error from user service', async () => {
      // Arrange
      const errorMessage: string = 'ActivateUser error';

      userServiceStub.activateUser.rejects(new Error(errorMessage));

      // Act
      const result: Promise<RegistrationConfirmation> = securityFacade.activateUser(v4());

      // Assert
      await expect(result).to.be
        .eventually.rejectedWith(errorMessage)
        .and.be.instanceOf(Error);
      expect(userServiceStub.activateUser).to.be.calledOnce;
    });
  });
});
