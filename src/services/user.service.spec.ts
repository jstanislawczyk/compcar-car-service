import {UserService} from './user.service';
import {UserRepository} from '../repositories/user.repository';
import {expect, use} from 'chai';
import {fullUser, user} from '../../test/fixtures/user.fixture';
import {User} from '../models/entities/user';
import sinon, {SinonSandbox, SinonStub, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import bcrypt from 'bcrypt';
import config from 'config';
import {UserRole} from '../enums/user-role';
import {EntityAlreadyExistsError} from '../models/errors/entity-already-exists.error';

use(sinonChai);
use(chaiAsPromised);

context('UserService', () => {

  let sandbox: SinonSandbox;
  let userRepositoryStub: SinonStubbedInstance<UserRepository>;
  let userService: UserService;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    userRepositoryStub = sandbox.createStubInstance(UserRepository);
    userService = new UserService(userRepositoryStub as unknown as UserRepository);

    userRepositoryStub.findOneOrFail.resolves(user);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findAll', () => {
    it('should get users list', async () => {
      // Arrange
      const usersList: User[] = [
        user,
        fullUser,
      ];

      userRepositoryStub.find.resolves(usersList);

      // Act
      const usersResult: User[] = await userService.findAll();

      // Assert
      expect(usersResult).to.be.have.length(2);
      expect(usersResult[0]).to.be.eql(user);
      expect(usersResult[1]).to.be.eql(fullUser);
      expect(userRepositoryStub.find).to.be.calledOnce;
    });

    it('should throw error', () => {
      // Arrange
      userRepositoryStub.find.rejects(new Error('Find error'));

      // Act
      const usersResult: Promise<User[]> = userService.findAll();

      // Assert
      expect(usersResult).to.eventually.be.rejectedWith('Find error');
    });
  });

  describe('findOneById', () => {
    it('should get user', async () => {
      // Arrange
      const userId: number = 1;

      // Act
      const userResult: User = await userService.findOneById(userId);

      // Assert
      expect(userResult).to.be.eql(userResult);
      expect(userRepositoryStub.findOneOrFail).to.be.calledOnce;
      expect(userRepositoryStub.findOneOrFail).to.be.calledOnceWith({
        id: userId,
      });
    });

    it('should throw error', () => {
      // Arrange
      userRepositoryStub.findOneOrFail.rejects(new Error('Find error'));

      // Act
      const userResult: Promise<User> = userService.findOneById(1);

      // Assert
      expect(userResult).to.eventually.be.rejectedWith('Find error');
    });
  });

  describe('findOneByEmail', () => {
    it('should get user', async () => {
      // Arrange
      const email: string = 'test@mail.com';

      // Act
      const userResult: User = await userService.findOneByEmail(email);

      // Assert
      expect(userResult).to.be.eql(userResult);
      expect(userRepositoryStub.findOneOrFail).to.be.calledOnceWith({
        email,
      });
    });

    it('should throw error', () => {
      // Arrange
      userRepositoryStub.findOneOrFail.rejects(new Error('Find error'));

      // Act
      const userResult: Promise<User> = userService.findOneByEmail('test@mail.com');

      // Assert
      expect(userResult).to.eventually.be.rejectedWith('Find error');
    });
  });

  describe('saveUser', () => {
    it('should save user', async () => {
      // Arrange
      const saltRounds: number = config.get('security.bcrypt.rounds');
      const hashedPassword: string = 'hashedPassword';
      const userToSave: User = user;
      const plainPassword: string = userToSave.password;
      const savedUser: User = {
        ...user,
        id: 11,
        password: bcrypt.hashSync(userToSave.password, 1),
      };
      const bcryptStub: SinonStub = sandbox.stub(bcrypt, 'hashSync');

      bcryptStub.returns(hashedPassword);

      userRepositoryStub.findOne.onFirstCall().resolves(undefined);
      userRepositoryStub.findOne.onSecondCall().resolves(fullUser);
      userRepositoryStub.save.resolves(savedUser);

      // Act
      const savedUserResult: User = await userService.saveUser(userToSave);

      // Assert
      expect(savedUserResult.id).to.be.eql(savedUser.id);
      expect(savedUserResult.email).to.be.eql(savedUser.email);
      expect(savedUserResult.password).to.be.eql(savedUser.password);
      expect(savedUserResult.role).to.be.eql(savedUser.role);
      expect(savedUserResult.registerDate).to.be.eql(savedUser.registerDate);
      expect(savedUserResult.activated).to.be.true;

      expect(userRepositoryStub.save).to.be.calledOnceWith({
        ...userToSave,
        password: hashedPassword,
        role: UserRole.USER,
      });
      expect(bcryptStub).to.be.calledOnceWith(plainPassword, saltRounds);
      expect(userRepositoryStub.findOne).to.be.calledTwice;
      expect(userRepositoryStub.findOne.firstCall).to.be.calledWith({
        select: ['id'],
        where: {
          email: userToSave.email,
        },
      });
      expect(userRepositoryStub.findOne.secondCall).to.be.calledWith({
        select: ['id'],
      });
    });

    describe('should save admin if first user is created', () => {
      it('if user body has ADMIN role', async () => {
        // Arrange
        const hashedPassword: string = 'hashedPassword';
        const userToSave: User = user;
        const savedUser: User = {
          ...user,
          id: 11,
          password: bcrypt.hashSync(userToSave.password, 1),
          role: UserRole.ADMIN,
        };
        const bcryptStub: SinonStub = sandbox.stub(bcrypt, 'hashSync');

        bcryptStub.returns(hashedPassword);

        userRepositoryStub.findOne.onFirstCall().resolves(undefined);
        userRepositoryStub.findOne.onSecondCall().resolves(undefined);
        userRepositoryStub.save.resolves(savedUser);

        // Act
        const savedUserResult: User = await userService.saveUser(userToSave);

        // Assert
        expect(savedUserResult.id).to.be.eql(savedUser.id);
        expect(savedUserResult.email).to.be.eql(savedUser.email);
        expect(savedUserResult.password).to.be.eql(savedUser.password);
        expect(savedUserResult.role).to.be.eql(savedUser.role);
        expect(savedUserResult.registerDate).to.be.eql(savedUser.registerDate);
        expect(savedUserResult.activated).to.be.true;

        expect(userRepositoryStub.save).to.be.calledOnceWith({
          ...userToSave,
          password: hashedPassword,
          role: UserRole.ADMIN,
        });
      });

      it('if user body has USER role', async () => {
        // Arrange
        const hashedPassword: string = 'hashedPassword';
        const userToSave: User = user;
        const savedUser: User = {
          ...user,
          id: 11,
          password: bcrypt.hashSync(userToSave.password, 1),
        };
        const bcryptStub: SinonStub = sandbox.stub(bcrypt, 'hashSync');

        bcryptStub.returns(hashedPassword);

        userRepositoryStub.findOne.onFirstCall().resolves(undefined);
        userRepositoryStub.findOne.onSecondCall().resolves(undefined);
        userRepositoryStub.save.resolves(savedUser);

        // Act
        const savedUserResult: User = await userService.saveUser(userToSave);

        // Assert
        expect(savedUserResult.id).to.be.eql(savedUser.id);
        expect(savedUserResult.email).to.be.eql(savedUser.email);
        expect(savedUserResult.password).to.be.eql(savedUser.password);
        expect(savedUserResult.role).to.be.eql(savedUser.role);
        expect(savedUserResult.registerDate).to.be.eql(savedUser.registerDate);
        expect(savedUserResult.activated).to.be.true;

        expect(userRepositoryStub.save).to.be.calledOnceWith({
          ...userToSave,
          password: hashedPassword,
          role: UserRole.ADMIN,
        });
      });
    });

    it('should throw error if user already exists', async () => {
      // Arrange
      const userToSave: User = user;

      userRepositoryStub.findOne.onFirstCall().resolves(fullUser);

      // Act
      const savedUserResult: Promise<User> = userService.saveUser(userToSave);

      // Assert
      await expect(savedUserResult).to.eventually.be
        .rejectedWith(`User with email "${userToSave.email}" already exist`)
        .and.be.an.instanceOf(EntityAlreadyExistsError);
      expect(userRepositoryStub.findOne).to.be.calledOnce;
    });

    it('should rethrow error', async () => {
      // Arrange
      const userToSave: User = user;

      userRepositoryStub.findOne.onFirstCall().rejects(new Error('DB error'));

      // Act
      const savedUserResult: Promise<User> = userService.saveUser(userToSave);

      // Assert
      await expect(savedUserResult).to.eventually.be.rejectedWith('DB error');
    });
  });
});
