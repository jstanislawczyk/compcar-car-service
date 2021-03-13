import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {UserService} from '../services/user.service';
import {SecurityFacade} from './security.facade';
import {TokenService} from '../services/token.service';
import {User} from '../models/entities/user';
import {LoginCredentials} from '../models/common/login-credentials';
import {AuthenticationError} from 'apollo-server';
import {UserBuilder} from '../../test/utils/builders/user.builder';

use(sinonChai);
use(chaiAsPromised);

context('SecurityFacade', () => {

  let sandbox: SinonSandbox;
  let userServiceStub: SinonStubbedInstance<UserService>;
  let tokenServiceStub: SinonStubbedInstance<TokenService>;
  let securityFacade: SecurityFacade;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    userServiceStub = sandbox.createStubInstance(UserService);
    tokenServiceStub = sandbox.createStubInstance(TokenService);

    securityFacade = new SecurityFacade(
      userServiceStub as unknown as UserService,
      tokenServiceStub as unknown as TokenService,
    );
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
      tokenServiceStub.getUserToken.rejects('TokenService Error');

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
    });

    it('should throw error', async () => {
      // Arrange
      userServiceStub.saveUser.rejects(new Error('RegisterUser error'));

      // Act
      const userRegisterResult: Promise<User> = securityFacade.registerUser(new UserBuilder().build());

      // Assert
      await expect(userRegisterResult).to.eventually.be.rejectedWith('RegisterUser error');
    });
  });

});
