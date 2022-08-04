import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {expect, use} from 'chai';
import {UserDatabaseUtils} from '../utils/database-utils/user.database-utils';
import {RegisterInput} from '../../src/models/inputs/user/register.input';
import {User} from '../../src/models/entities/user';
import {DateUtils} from '../utils/common/date.utils';
import {UserBuilder} from '../utils/builders/user.builder';
import {LoginInput} from '../../src/models/inputs/user/login.input';
import {StringUtils} from '../utils/common/string.utils';
import {ResponseError} from '../utils/interfaces/response-error';
import {TestValidationError} from '../utils/interfaces/validation-error';
import {CommonDatabaseUtils} from '../utils/database-utils/common.database-utils';
import {UserRole} from '../../src/models/enums/user-role';
import {EmailService} from '../../src/services/email.service';
import config from 'config';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import sinon, {SinonSandbox, SinonStub} from 'sinon';
import {RegistrationConfirmation} from '../../src/models/entities/registration-confirmation';
import sinonChai from 'sinon-chai';
import {v4} from 'uuid';
import {RegistrationConfirmationBuilder} from '../utils/builders/registration-confirmation.builder';
import {RegistrationConfirmationDatabaseUtils} from '../utils/database-utils/registration-confirmation.database-utils';

use(sinonChai);

describe('Security', () => {

  let sandbox: SinonSandbox;
  let emailTransporterStub: SinonStub;
  let sendMailStub: SinonStub;

  before(async () =>
    await CommonDatabaseUtils.deleteAllEntities()
  );

  beforeEach(async () => {
    await UserDatabaseUtils.deleteAllUsers();

    sandbox = sinon.createSandbox();

    emailTransporterStub = sandbox.stub(nodemailer, 'createTransport');
    sendMailStub = sandbox.stub();

    sendMailStub.resolves();
    emailTransporterStub.returns({
      sendMail: sendMailStub,
    });

    if ((EmailService as any).mailTransporter === undefined) {
      (EmailService as any).mailTransporter = emailTransporterStub;
    }
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('register', () => {
    describe('should register user', () => {
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
        expect(returnedUserBody.activated).to.be.false;
        expect(returnedUserBody.role).to.be.eql(UserRole.ADMIN);

        const savedUser: User = await UserDatabaseUtils.getUserByIdOrFail(
          Number(returnedUserBody.id),
          {
            relations: ['registrationConfirmation'],
          },
        );

        expect(savedUser.id).to.be.eql(Number(returnedUserBody.id));
        expect(savedUser.email).to.be.eql(returnedUserBody.email);
        expect(savedUser.password).to.be.eql(returnedUserBody.password);
        expect(savedUser.registerDate).to.be.eql(returnedUserBody.registerDate);
        expect(savedUser.activated).to.be.eql(returnedUserBody.activated);
        expect(savedUser.role).to.be.eql(returnedUserBody.role);

        const registrationConfirmation = savedUser.registrationConfirmation as RegistrationConfirmation;

        expect(registrationConfirmation.id).to.be.above(0);
        expect(registrationConfirmation.confirmedAt).to.be.null;
        expect(DateUtils.isISODate(registrationConfirmation.allowedConfirmationDate)).to.be.true;
        expect(StringUtils.isV4(registrationConfirmation.code)).to.be.true;

        expect(sendMailStub).to.be.calledOnce;
        expect(sendMailStub.firstCall.firstArg.to).to.be.eql(savedUser.email);
        expect(sendMailStub.firstCall.firstArg.from).to.be.eql(config.get('email.auth.user'));
        expect(sendMailStub.firstCall.firstArg.html).to.include(registrationConfirmation.code);
        expect(sendMailStub.firstCall.firstArg.text).to.include(registrationConfirmation.code);
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

        await UserDatabaseUtils.saveUser(new UserBuilder().build());

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
        expect(returnedUserBody.activated).to.be.false;
        expect(returnedUserBody.role).to.be.eql(UserRole.USER);

        const savedUser: User = await UserDatabaseUtils.getUserByIdOrFail(
          Number(returnedUserBody.id),
          {
            relations: ['registrationConfirmation'],
          },
        );

        expect(savedUser.id).to.be.eql(Number(returnedUserBody.id));
        expect(savedUser.email).to.be.eql(returnedUserBody.email);
        expect(savedUser.password).to.be.eql(returnedUserBody.password);
        expect(savedUser.registerDate).to.be.eql(returnedUserBody.registerDate);
        expect(savedUser.activated).to.be.eql(returnedUserBody.activated);
        expect(savedUser.role).to.be.eql(returnedUserBody.role);

        const registrationConfirmation = savedUser.registrationConfirmation as RegistrationConfirmation;

        expect(registrationConfirmation.id).to.be.above(0);
        expect(registrationConfirmation.confirmedAt).to.be.null;
        expect(DateUtils.isISODate(registrationConfirmation.allowedConfirmationDate)).to.be.true;
        expect(StringUtils.isV4(registrationConfirmation.code)).to.be.true;
      });
    });

    describe('should throw error', () => {
      it('if validation fails', async () => {
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
                passwordRepeat: "${registerInput.passwordRepeat}",
              }
            ) {
              id,
            }
          }
        `;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({query})
          .expect(200);

        const savedUsers: User[] = await UserDatabaseUtils.getAllUsers();
        expect(savedUsers).to.be.empty;

        const errorsBody: ResponseError = response.body.errors[0];
        expect(errorsBody.message).to.be.eql('Argument Validation Error');

        const errors: TestValidationError[] = errorsBody.extensions.exception.validationErrors;
        expect(errors).to.be.an('array').lengthOf(3);

        expect(errors[0].property).to.be.eql('email');
        expect(errors[0].value).to.be.eql('wrong_mail');
        expect(errors[0].constraints.isEmail).to.be.eql('email must be an email');
        expect(errors[1].property).to.be.eql('password');
        expect(errors[1].value).to.be.eql('test');
        expect(errors[1].constraints.isPassword).to.be.eql(
          'Password should contain minimum six characters, at least one uppercase letter, one lowercase letter and one number'
        );
        expect(errors[2].property).to.be.eql('passwordRepeat');
        expect(errors[2].value).to.be.eql('123');
        expect(errors[2].constraints.matchProperty).to.be.eql(`"password" value doesn't match "passwordRepeat" property`);
      });

      it('if email sending fails', async () => {
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
            }
          }
        `;

        sendMailStub.rejects();
        emailTransporterStub.returns({
          sendMail: sendMailStub,
        });
        (EmailService as any).mailTransporter = emailTransporterStub;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({query})
          .expect(200);

        const errorsBody: ResponseError = response.body.errors[0];
        expect(errorsBody.message).to.be.eql(`Failed to send an email to ${registerInput.email} address`);
        expect(errorsBody.extensions.code).to.be.eql('EMAIL_SENDING_FAILURE');
      });
    });
  });

  describe('login', () => {
    it('should authenticate user', async () => {
      // Arrange
      const loginInput: LoginInput = {
        email: 'test@mail.com',
        password: '1qazXSW@',
      } as LoginInput;

      const query: string = `
        {
          login (
            loginInput: {
              email: "${loginInput.email}",
              password: "${loginInput.password}",
            }
          )
        }
      `;

      const saltRounds: number = config.get('security.bcrypt.rounds');
      const userToSave: User = new UserBuilder()
        .withEmail(loginInput.email)
        .withPassword(bcrypt.hashSync(loginInput.password, saltRounds))
        .build();

      await UserDatabaseUtils.saveUser(userToSave);

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      expect(StringUtils.isJwtToken(response.body.data.login)).to.be.true;
    });

    it('should fail authentication for inactive user', async () => {
      // Arrange
      const loginInput: LoginInput = {
        email: 'test@mail.com',
        password: '1qazXSW@',
      } as LoginInput;

      const query: string = `
        {
          login (
            loginInput: {
              email: "${loginInput.email}",
              password: "${loginInput.password}",
            }
          )
        }
      `;

      const saltRounds: number = config.get('security.bcrypt.rounds');
      const userToSave: User = new UserBuilder()
        .withEmail(loginInput.email)
        .withPassword(bcrypt.hashSync(loginInput.password, saltRounds))
        .withActivated(false)
        .build();

      await UserDatabaseUtils.saveUser(userToSave);

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const errorsBody: ResponseError = response.body.errors[0];
      expect(errorsBody.message).to.be.eql('User account is inactive. Please confirm email');
      expect(errorsBody.extensions.code).to.be.eql('INACTIVE_ACCOUNT');
    });

    it('should fail authentication for wrong email provided', async () => {
      // Arrange
      const loginInput: LoginInput = {
        email: 'not_existing@mail.com',
        password: '1qazXSW@',
      } as LoginInput;

      const query: string = `
        {
          login (
            loginInput: {
              email: "${loginInput.email}",
              password: "${loginInput.password}",
            }
          )
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const errorsBody: ResponseError = response.body.errors[0];
      expect(errorsBody.message).to.be.eql('Credentials are incorrect');
      expect(errorsBody.extensions.code).to.be.eql('UNAUTHENTICATED');
    });

    it('should fail authentication for wrong password provided', async () => {
      // Arrange
      const loginInput: LoginInput = {
        email: 'test@mail.com',
        password: '1qazXSW@',
      } as LoginInput;

      const query: string = `
        {
          login (
            loginInput: {
              email: "${loginInput.email}",
              password: "${loginInput.password}",
            }
          )
        }
      `;

      const userToSave: User = new UserBuilder()
        .withEmail(loginInput.email)
        .build();

      await UserDatabaseUtils.saveUser(userToSave);

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const errorsBody: ResponseError = response.body.errors[0];
      expect(errorsBody.message).to.be.eql('Credentials are incorrect');
      expect(errorsBody.extensions.code).to.be.eql('UNAUTHENTICATED');
    });
  });

  describe('activateUser', () => {
    it('should activate user', async () => {
      // Arrange
      const code: string = v4();

      const query: string = `
        mutation {
          activateUser (
            confirmationCode: "${code}",
          ) {
            id,
            allowedConfirmationDate,
            confirmedAt,
          },
        }
      `;

      const registrationConfirmation: RegistrationConfirmation = new RegistrationConfirmationBuilder()
        .withCode(code)
        .withAllowedConfirmationDate(new Date(Date.now() + 10_000).toISOString())
        .build();

      const userToSave: User = new UserBuilder()
        .withRegistrationConfirmation(registrationConfirmation)
        .withActivated(false)
        .build();

      await RegistrationConfirmationDatabaseUtils.saveRegistrationConfirmation(registrationConfirmation);
      await UserDatabaseUtils.saveUser(userToSave);

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({query})
        .expect(200);

      const returnedRegistrationConfirmationBody: RegistrationConfirmation =
        response.body.data.activateUser as RegistrationConfirmation;

      expect(Number(returnedRegistrationConfirmationBody.id)).to.be.above(0);
      expect(returnedRegistrationConfirmationBody.allowedConfirmationDate).to.be
        .eql(registrationConfirmation.allowedConfirmationDate);
      expect(DateUtils.isISODate(returnedRegistrationConfirmationBody.confirmedAt as string)).to.be.true;

      const activatedUser: User = await UserDatabaseUtils.getUserByIdOrFail(userToSave.id as number);
      expect(activatedUser.activated).to.be.true;
    });

    describe('should throw error', () => {
      it("if code doesn't exist", async () => {
        // Arrange
        const code: string = v4();

        const query: string = `
          mutation {
            activateUser (
              confirmationCode: "${code}",
            ) {
              id,
            },
          }
        `;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({query})
          .expect(200);

        const errorsBody: ResponseError = response.body.errors[0];
        expect(errorsBody.message).to.be.eql(`Registration confirmation with code=${code} not found`);
        expect(errorsBody.extensions.code).to.be.eql('NOT_FOUND');
      });

      it('if registration confirmation is outdated', async () => {
        // Arrange
        const code: string = v4();

        const query: string = `
          mutation {
            activateUser (
              confirmationCode: "${code}",
            ) {
              id,
            },
          }
        `;

        const registrationConfirmation: RegistrationConfirmation = new RegistrationConfirmationBuilder()
          .withCode(code)
          .withAllowedConfirmationDate(new Date(Date.now() - 10_000).toISOString())
          .build();

        await RegistrationConfirmationDatabaseUtils.saveRegistrationConfirmation(registrationConfirmation);

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({query})
          .expect(200);

        const errorsBody: ResponseError = response.body.errors[0];
        expect(errorsBody.message).to.be.eql(`Registration confirmation with code=${code} is outdated`);
        expect(errorsBody.extensions.code).to.be.eql('OUTDATED');
      });

      it('if confirmation was already confirmed', async () => {
        // Arrange
        const code: string = v4();

        const query: string = `
          mutation {
            activateUser (
              confirmationCode: "${code}",
            ) {
              id,
            },
          }
        `;

        const registrationConfirmation: RegistrationConfirmation = new RegistrationConfirmationBuilder()
          .withCode(code)
          .withAllowedConfirmationDate(new Date(Date.now() + 10_000).toISOString())
          .withConfirmedAt(new Date(Date.now() + 5_000).toISOString())
          .build();

        await RegistrationConfirmationDatabaseUtils.saveRegistrationConfirmation(registrationConfirmation);

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({query})
          .expect(200);

        const errorsBody: ResponseError = response.body.errors[0];
        expect(errorsBody.message).to.be.eql(`Registration confirmation with code=${code} was already confirmed`);
        expect(errorsBody.extensions.code).to.be.eql('ALREADY_CONFIRMED');
      });
    });
  });
});
