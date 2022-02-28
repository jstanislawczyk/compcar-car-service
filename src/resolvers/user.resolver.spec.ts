import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {UserService} from '../services/user.service';
import {UserResolver} from './user.resolver';
import {User} from '../models/entities/user';
import {UserBuilder} from '../../test/utils/builders/user.builder';

use(sinonChai);
use(chaiAsPromised);

context('UserResolver', () => {

  let sandbox: SinonSandbox;
  let userServiceStub: SinonStubbedInstance<UserService>;
  let userResolver: UserResolver;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    userServiceStub = sandbox.createStubInstance(UserService);

    userResolver = new UserResolver(userServiceStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getUsers', () => {
    it('should return users list', async () => {
      // Arrange
      const savedUsers: User[] = [
        new UserBuilder().build(),
        new UserBuilder()
          .withEmail('second@mail.com')
          .withActivated(true)
          .build(),
      ];

      userServiceStub.findAll.resolves(savedUsers);

      // Act
      const users: User[] = await userResolver.getUsers();

      // Assert
      expect(users).to.have.length(2);
      expect(users).to.be.eql(savedUsers);
    });

    it('should throw error', async () => {
      // Arrange
      userServiceStub.findAll.rejects(new Error('FindAll error'));

      // Act
      const findAllUsersResult: Promise<User[]> = userResolver.getUsers();

      // Assert
      await expect(findAllUsersResult).to.eventually.be.rejectedWith('FindAll error');
    });
  });
});
