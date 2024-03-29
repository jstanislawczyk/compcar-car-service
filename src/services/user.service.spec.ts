import {UserService} from './user.service';
import {UserRepository} from '../repositories/user.repository';
import {expect, use} from 'chai';
import {User} from '../models/entities/user';
import sinon, {SinonFakeTimers, SinonSandbox, SinonStub, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import bcrypt from 'bcryptjs';
import config from 'config';
import {EntityAlreadyExistsError} from '../models/errors/entity-already-exists.error';
import {UserBuilder} from '../../test/utils/builders/user.builder';
import {UserRole} from '../models/enums/user-role';
import {RegistrationConfirmationRepository} from '../repositories/registration-confirmation.repository';
import {RegistrationConfirmation} from '../models/entities/registration-confirmation';
import {RegistrationConfirmationBuilder} from '../../test/utils/builders/registration-confirmation.builder';
import {StringUtils} from '../../test/utils/common/string.utils';
import {v4} from 'uuid';
import {NotFoundError} from '../models/errors/not-found.error';
import {OutdatedError} from '../models/errors/outdated.error';
import {AlreadyConfirmedError} from '../models/errors/already-confirmed.error';

use(sinonChai);
use(chaiAsPromised);

context('UserService', () => {

  let sandbox: SinonSandbox;
  let userRepositoryStub: SinonStubbedInstance<UserRepository>;
  let registrationConfirmationRepositoryStub: SinonStubbedInstance<RegistrationConfirmationRepository>;
  let userService: UserService;
  let clock: SinonFakeTimers;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    userRepositoryStub = sandbox.createStubInstance(UserRepository);
    registrationConfirmationRepositoryStub = sandbox.createStubInstance(RegistrationConfirmationRepository);
    userService = new UserService(userRepositoryStub, registrationConfirmationRepositoryStub);

    userRepositoryStub.findOneOrFail.resolves(new UserBuilder().build());
  });

  afterEach(() => {
    if (clock) {
      clock.restore();
    }

    sandbox.restore();
  });

  describe('findAll', () => {
    it('should get users list', async () => {
      // Arrange
      const usersList: User[] = [
        new UserBuilder().build(),
        new UserBuilder(true).build(),
      ];

      userRepositoryStub.find.resolves(usersList);

      // Act
      const usersResult: User[] = await userService.findAll();

      // Assert
      expect(usersResult).to.be.an('array').length(2);
      expect(usersResult[0]).to.be.eql(usersList[0]);
      expect(usersResult[1]).to.be.eql(usersList[1]);
      expect(userRepositoryStub.find).to.be.calledOnce;
    });

    it('should throw error', async () => {
      // Arrange
      userRepositoryStub.find.rejects(new Error('Find error'));

      // Act
      const usersResult: Promise<User[]> = userService.findAll();

      // Assert
      await expect(usersResult).to.eventually.be.rejectedWith('Find error');
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
      expect(userRepositoryStub.findOneOrFail).to.be.calledOnceWith({
        id: userId,
      });
    });

    it('should throw error', async () => {
      // Arrange
      userRepositoryStub.findOneOrFail.rejects(new Error('Find error'));

      // Act
      const userResult: Promise<User> = userService.findOneById(1);

      // Assert
      await expect(userResult).to.eventually.be.rejectedWith('Find error');
    });
  });

  describe('findOneByEmail', () => {
    it('should get user', async () => {
      // Arrange
      const email: string = 'test@mail.com';

      // Act
      const userResult: User | undefined = await userService.findOneByEmail(email);

      // Assert
      expect(userResult).to.be.eql(userResult);
      expect(userRepositoryStub.findOne).to.be.calledOnceWith({
        email,
      });
    });

    it('should return undefined', async () => {
      // Arrange
      userRepositoryStub.findOne.resolves();

      // Act
      const user: User | undefined = await userService.findOneByEmail('test@mail.com');

      // Assert
      await expect(user).to.be.undefined;
    });

    it('should throw error', async () => {
      // Arrange
      userRepositoryStub.findOne.rejects(new Error('Find error'));

      // Act
      const userResult: Promise<User | undefined> = userService.findOneByEmail('test@mail.com');

      // Assert
      await expect(userResult).to.eventually.be.rejectedWith('Find error');
    });
  });

  describe('saveUser', () => {
    it('should save user', async () => {
      // Arrange
      const saltRounds: number = config.get('security.bcrypt.rounds');
      const hashedPassword: string = 'hashedPassword';
      const userToSave: User = new UserBuilder().build();
      const plainPassword: string = userToSave.password;
      const savedUser: User = new UserBuilder()
        .withId(11)
        .withPassword(bcrypt.hashSync(userToSave.password, 1))
        .build();
      const bcryptStub: SinonStub = sandbox.stub(bcrypt, 'hashSync');

      bcryptStub.returns(hashedPassword);

      userRepositoryStub.findOne.onFirstCall().resolves(undefined);
      userRepositoryStub.findOne.onSecondCall().resolves(new UserBuilder(true).build());
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
        const userToSave: User = new UserBuilder().build();
        const savedUser: User = new UserBuilder(true)
          .withId(11)
          .withPassword(bcrypt.hashSync(userToSave.password, 1))
          .withRole(UserRole.ADMIN)
          .build();
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
        const userToSave: User = new UserBuilder().build();
        const savedUser: User = new UserBuilder(true)
          .withId(11)
          .withPassword(bcrypt.hashSync(userToSave.password, 1))
          .build();
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
      const userToSave: User = new UserBuilder().build();

      userRepositoryStub.findOne.onFirstCall().resolves(new UserBuilder(true).build());

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
      const userToSave: User = new UserBuilder().build();

      userRepositoryStub.findOne.onFirstCall().rejects(new Error('DB error'));

      // Act
      const savedUserResult: Promise<User> = userService.saveUser(userToSave);

      // Assert
      await expect(savedUserResult).to.eventually.be.rejectedWith('DB error');
    });
  });

  describe('createUserRegistrationConfirmation', () => {
    it('should save registration confirmation', async () => {
      // Arrange
      const user: User = new UserBuilder(true)
        .withRegisterDate('2022-07-27T18:00:00.000Z')
        .build();
      const savedRegistrationConfirmation: RegistrationConfirmation = new RegistrationConfirmationBuilder(true).build();

      registrationConfirmationRepositoryStub.save.resolves(savedRegistrationConfirmation);

      // Act
      const returnedRegistrationConfirmation: RegistrationConfirmation =
        await userService.createUserRegistrationConfirmation(user);

      // Assert
      expect(returnedRegistrationConfirmation).to.be.eql(savedRegistrationConfirmation);
      expect(registrationConfirmationRepositoryStub.save).to.be.calledOnce;

      const registrationConfirmationSaveArg: RegistrationConfirmation =
        registrationConfirmationRepositoryStub.save.firstCall.firstArg;
      expect(registrationConfirmationSaveArg.id).to.be.undefined;
      expect(registrationConfirmationSaveArg.confirmedAt).to.be.undefined;
      expect(registrationConfirmationSaveArg.allowedConfirmationDate).to.be.eql('2022-07-27T19:00:00.000Z');
      expect(registrationConfirmationSaveArg.user).to.be.eql(user);
      expect(StringUtils.isV4(returnedRegistrationConfirmation.code)).to.be.true;
    });

    it('should rethrow error', async () => {
      // Arrange
      const errorMessage: string = 'DB error';
      const user: User = new UserBuilder(true).build();

      registrationConfirmationRepositoryStub.save.rejects(new Error(errorMessage));

      // Act
      const registrationConfirmationSavingResult: Promise<RegistrationConfirmation> =
        userService.createUserRegistrationConfirmation(user);

      // Assert
      await expect(registrationConfirmationSavingResult).to.eventually.be.rejectedWith(errorMessage);
    });
  });

  describe('activateUser', () => {
    it('should activate user', async () => {
      // Arrange
      const code: string = v4();
      const newDate: Date = new Date();
      const user: User = new UserBuilder()
        .withActivated(true)
        .build();
      const registrationConfirmation: RegistrationConfirmation = new RegistrationConfirmationBuilder()
        .withAllowedConfirmationDate(new Date(Date.now() + 10_000).toISOString())
        .withCode(code)
        .withUser(user)
        .build();

      clock = sinon.useFakeTimers(newDate);
      registrationConfirmationRepositoryStub.findOne.resolves(registrationConfirmation);
      registrationConfirmationRepositoryStub.save.resolves({
        ...registrationConfirmation,
        confirmedAt: newDate.toISOString(),
      });
      userRepositoryStub.save.resolves({
        ...user,
        activated: true,
      });

      // Act
      const updatedRegistrationConfirmation: RegistrationConfirmation = await userService.activateUser(code);

      // Assert
      expect(updatedRegistrationConfirmation.id).to.be.eql(registrationConfirmation.id);
      expect(updatedRegistrationConfirmation.allowedConfirmationDate).to.be.eql(registrationConfirmation.allowedConfirmationDate);
      expect(updatedRegistrationConfirmation.confirmedAt).to.be.eql(newDate.toISOString());
      expect(updatedRegistrationConfirmation.code).to.be.eql(registrationConfirmation.code);
      expect(updatedRegistrationConfirmation.user).to.be.eql(user);

      expect(registrationConfirmationRepositoryStub.findOne).to.be.calledOnceWith({ code });
      expect(userRepositoryStub.save).to.be.calledOnceWith({
        ...user,
        activated: true,
      });
      expect(registrationConfirmationRepositoryStub.save).to.be.calledOnceWith({
        ...registrationConfirmation,
        confirmedAt: newDate.toISOString(),
      });
    });

    describe('should throw error', () => {
      it("if confirmation with code doesn't exist", async () => {
        // Arrange
        const code: string = v4();

        registrationConfirmationRepositoryStub.findOne.resolves();

        // Act
        const result: Promise<RegistrationConfirmation> = userService.activateUser(code);

        // Assert
        await expect(result).to.eventually
          .be.rejectedWith(`Registration confirmation with code=${code} not found`)
          .and.be.instanceOf(NotFoundError);
        expect(registrationConfirmationRepositoryStub.findOne).to.be.calledOnce;
        expect(userRepositoryStub.save).to.be.not.called;
        expect(registrationConfirmationRepositoryStub.save).to.be.not.called;
      });

      it('if confirmation is outdated', async () => {
        // Arrange
        const code: string = v4();
        const registrationConfirmation: RegistrationConfirmation = new RegistrationConfirmationBuilder()
          .withCode(code)
          .withAllowedConfirmationDate(new Date(Date.now() - 10_000).toISOString())
          .build();

        registrationConfirmationRepositoryStub.findOne.resolves(registrationConfirmation);

        // Act
        const result: Promise<RegistrationConfirmation> = userService.activateUser(registrationConfirmation.code);

        // Assert
        await expect(result).to.eventually
          .be.rejectedWith(`Registration confirmation with code=${code} is outdated`)
          .and.be.instanceOf(OutdatedError);
        expect(registrationConfirmationRepositoryStub.findOne).to.be.calledOnce;
        expect(userRepositoryStub.save).to.be.not.called;
        expect(registrationConfirmationRepositoryStub.save).to.be.not.called;
      });

      it('if confirmation was already confirmed', async () => {
        // Arrange
        const code: string = v4();
        const registrationConfirmation: RegistrationConfirmation = new RegistrationConfirmationBuilder()
          .withCode(code)
          .withAllowedConfirmationDate(new Date(Date.now() + 10_000).toISOString())
          .withConfirmedAt(new Date(Date.now() + 5_000).toISOString())
          .build();

        registrationConfirmationRepositoryStub.findOne.resolves(registrationConfirmation);

        // Act
        const result: Promise<RegistrationConfirmation> = userService.activateUser(registrationConfirmation.code);

        // Assert
        await expect(result).to.eventually
          .be.rejectedWith(`Registration confirmation with code=${code} was already confirmed`)
          .and.be.instanceOf(AlreadyConfirmedError);
        expect(registrationConfirmationRepositoryStub.findOne).to.be.calledOnce;
        expect(userRepositoryStub.save).to.be.not.called;
        expect(registrationConfirmationRepositoryStub.save).to.be.not.called;
      });

      it('coming from registration confirmation repository findOne method', async () => {
        // Arrange
        const errorMessage: string = 'RegistrationConfirmation findOne error';

        registrationConfirmationRepositoryStub.findOne.rejects(new Error(errorMessage));

        // Act
        const result: Promise<RegistrationConfirmation> = userService.activateUser(v4());

        // Assert
        await expect(result).to.eventually
          .be.rejectedWith(errorMessage)
          .and.be.instanceOf(Error);
        expect(registrationConfirmationRepositoryStub.findOne).to.be.calledOnce;
        expect(userRepositoryStub.save).to.be.not.called;
        expect(registrationConfirmationRepositoryStub.save).to.be.not.called;
      });

      it('coming from user repository save method', async () => {
        // Arrange
        const errorMessage: string = 'User save error';
        const code: string = v4();
        const newDate: Date = new Date();
        const user: User = new UserBuilder()
          .withActivated(true)
          .build();
        const registrationConfirmation: RegistrationConfirmation = new RegistrationConfirmationBuilder()
          .withAllowedConfirmationDate(new Date(Date.now() + 10_000).toISOString())
          .withCode(code)
          .withUser(user)
          .build();

        clock = sinon.useFakeTimers(newDate);
        registrationConfirmationRepositoryStub.findOne.resolves(registrationConfirmation);
        userRepositoryStub.save.rejects(new Error(errorMessage));

        // Act
        const result: Promise<RegistrationConfirmation> = userService.activateUser(code);

        // Assert
        await expect(result).to.eventually
          .be.rejectedWith(errorMessage)
          .and.be.instanceOf(Error);
        expect(registrationConfirmationRepositoryStub.findOne).to.be.calledOnce;
        expect(userRepositoryStub.save).to.be.calledOnce;
        expect(registrationConfirmationRepositoryStub.save).to.be.not.called;
      });

      it('coming from registration confirmation repository save method', async () => {
        // Arrange
        const errorMessage: string = 'RegistrationConfirmation save error';
        const code: string = v4();
        const newDate: Date = new Date();
        const user: User = new UserBuilder()
          .withActivated(true)
          .build();
        const registrationConfirmation: RegistrationConfirmation = new RegistrationConfirmationBuilder()
          .withAllowedConfirmationDate(new Date(Date.now() + 10_000).toISOString())
          .withCode(code)
          .withUser(user)
          .build();

        clock = sinon.useFakeTimers(newDate);
        registrationConfirmationRepositoryStub.findOne.resolves(registrationConfirmation);
        registrationConfirmationRepositoryStub.save.resolves({
          ...registrationConfirmation,
          confirmedAt: newDate.toISOString(),
        });
        registrationConfirmationRepositoryStub.save.rejects(new Error(errorMessage));

        // Act
        const result: Promise<RegistrationConfirmation> = userService.activateUser(code);

        // Assert
        await expect(result).to.eventually
          .be.rejectedWith(errorMessage)
          .and.be.instanceOf(Error);
        expect(registrationConfirmationRepositoryStub.findOne).to.be.calledOnce;
        expect(userRepositoryStub.save).to.be.calledOnce;
        expect(registrationConfirmationRepositoryStub.save).to.be.calledOnce;
      });
    });
  });
});
