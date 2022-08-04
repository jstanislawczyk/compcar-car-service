import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {SecurityResolver} from './security.resolver';
import {SecurityFacade} from '../facades/security.facade';
import {LoginCredentialsMapper} from '../mapper/login-credentials.mapper';
import {UserMapper} from '../mapper/user.mapper';
import {LoginInput} from '../models/inputs/user/login.input';
import {LoginCredentials} from '../models/common/security/login-credentials';
import {User} from '../models/entities/user';
import {RegisterInput} from '../models/inputs/user/register.input';
import {UserBuilder} from '../../test/utils/builders/user.builder';
import {RegistrationConfirmation} from '../models/entities/registration-confirmation';
import {RegistrationConfirmationBuilder} from '../../test/utils/builders/registration-confirmation.builder';
import {v4} from 'uuid';

use(sinonChai);
use(chaiAsPromised);

context('SecurityResolver', () => {

  let sandbox: SinonSandbox;
  let securityFacadeStub: SinonStubbedInstance<SecurityFacade>;
  let loginCredentialsMapperStub: SinonStubbedInstance<LoginCredentialsMapper>;
  let userMapperStub: SinonStubbedInstance<UserMapper>;
  let securityResolver: SecurityResolver;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    securityFacadeStub = sandbox.createStubInstance(SecurityFacade);
    loginCredentialsMapperStub = sandbox.createStubInstance(LoginCredentialsMapper);
    userMapperStub = sandbox.createStubInstance(UserMapper);

    securityResolver = new SecurityResolver(securityFacadeStub, loginCredentialsMapperStub, userMapperStub);
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('login', () => {
    it('should return authentication token', async () => {
      // Arrange
      const loginInput: LoginInput = {
        email: 'test@mail.com',
        password: '1qazXSW@',
      };
      const mappedLoginCredentials: LoginCredentials = {
        email: 'test@mail.com',
        password: '1qazXSW@',
      };
      const generatedToken: string = 'AuthToken';

      loginCredentialsMapperStub.toLoginCredentials.returns(mappedLoginCredentials);
      securityFacadeStub.authorizeUser.resolves(generatedToken);

      // Act
      const token: string = await securityResolver.login(loginInput);

      // Assert
      expect(token).to.be.eql(generatedToken);
      expect(loginCredentialsMapperStub.toLoginCredentials).to.be.calledOnceWith(loginInput);
      expect(securityFacadeStub.authorizeUser).to.be.calledOnceWith(mappedLoginCredentials);
    });

    it('should throw error if user authorize fails', async () => {
      const loginInput: LoginInput = {
        email: 'test@mail.com',
        password: '1qazXSW@',
      };
      const mappedLoginCredentials: LoginCredentials = {
        email: 'test@mail.com',
        password: '1qazXSW@',
      };

      loginCredentialsMapperStub.toLoginCredentials.returns(mappedLoginCredentials);
      securityFacadeStub.authorizeUser.rejects(new Error('AuthorizeUser error'));

      // Act
      const tokenResult: Promise<string> = securityResolver.login(loginInput);

      // Assert
      await expect(tokenResult).to.eventually.be.rejectedWith('AuthorizeUser error');
    });
  });

  describe('register', () => {
    it('should return registered user', async () => {
      // Arrange
      const registerInput: RegisterInput = {
        email: 'test@mail.com',
        password: '1qazXSW@',
        passwordRepeat: '1qazXSW@',
      };
      const mappedUser: User = new UserBuilder().build();
      const savedUser: User = new UserBuilder(true).build();

      userMapperStub.toRegisterUser.returns(mappedUser);
      securityFacadeStub.registerUser.resolves(savedUser);

      // Act
      const registeredUser: User = await securityResolver.register(registerInput);

      // Assert
      expect(registeredUser).to.be.eql(savedUser);
      expect(userMapperStub.toRegisterUser).to.be.calledOnceWith(registerInput);
      expect(securityFacadeStub.registerUser).to.be.calledOnceWith(mappedUser);
    });

    it('should throw error if user login fails', async () => {
      // Arrange
      const registerInput: RegisterInput = {
        email: 'test@mail.com',
        password: '1qazXSW@',
        passwordRepeat: '1qazXSW@',
      };

      userMapperStub.toRegisterUser.returns(new UserBuilder().build());
      securityFacadeStub.registerUser.rejects(new Error('RegisterUser error'));

      // Act
      const registeredUserResult: Promise<User> = securityResolver.register(registerInput);

      // Assert
      await expect(registeredUserResult).to.eventually.be.rejectedWith('RegisterUser error');
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

      securityFacadeStub.activateUser.resolves(registrationConfirmation);

      // Act
      const returnedRegistrationConfirmation: RegistrationConfirmation = await securityResolver.activateUser(confirmationCode);

      // Assert
      expect(returnedRegistrationConfirmation).to.be.eql(registrationConfirmation);
      expect(securityFacadeStub.activateUser).to.be.calledOnceWith(confirmationCode);
    });

    it('should rethrow error from facade', async () => {
      // Arrange
      const errorMessage: string = 'ActivateUser error';

      securityFacadeStub.activateUser.rejects(new Error(errorMessage));

      // Act
      const result: Promise<RegistrationConfirmation> = securityResolver.activateUser(v4());

      // Assert
      await expect(result).to.be
        .eventually.rejectedWith(errorMessage)
        .and.be.instanceOf(Error);
      expect(securityFacadeStub.activateUser).to.be.calledOnce;
    });
  });
});
