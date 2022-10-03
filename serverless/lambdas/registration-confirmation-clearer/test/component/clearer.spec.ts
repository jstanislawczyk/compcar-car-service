import {handler} from '../../src';
import { RegistrationConfirmation } from '../models/entities/registration-confirmation';
import {RegistrationConfirmationBuilder} from '../utils/builders/registration-confirmation.builder';
import {DateUtils} from '../common/date.utils';
import {RegistrationConfirmationDatabaseUtils} from '../utils/database-utils/registration-confirmation.database-utils';
import {expect} from 'chai';
import sinon, {SinonSandbox, SinonStub} from 'sinon';
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import {GetParameterResult} from 'aws-sdk/clients/ssm';

describe('RegistrationConfirmationClearer', () => {

  const getParameterResult: GetParameterResult = {
    Parameter: {
      Value: 'root',
    },
  };

  let sandbox: SinonSandbox;
  let ssmGetParameterStub: SinonStub;

  before(() =>
    initEnvVariables()
  );

  beforeEach(() => {
    RegistrationConfirmationDatabaseUtils.deleteAllRegistrationConfirmations();

    AWSMock.setSDKInstance(AWS);
    sandbox = sinon.createSandbox();

    ssmGetParameterStub = sandbox.stub();
    AWSMock.mock('SSM', 'getParameter', ssmGetParameterStub);

    ssmGetParameterStub.resolves(getParameterResult);
  });

  afterEach(() => {
    sandbox.restore();
    AWSMock.restore();
  });

  it('should delete multiple outdated registration confirmations', async () => {
    // Arrange
    const outdatedRegistrationConfirmation: RegistrationConfirmation = new RegistrationConfirmationBuilder()
      .withAllowedConfirmationDate(DateUtils.getISODateWithOffset(-100_000).toISOString())
      .build();
    const secondOutdatedRegistrationConfirmation: RegistrationConfirmation = new RegistrationConfirmationBuilder()
      .withAllowedConfirmationDate(DateUtils.getISODateWithOffset(-200_000).toISOString())
      .build();

    await RegistrationConfirmationDatabaseUtils.saveRegistrationConfirmationsList([
      outdatedRegistrationConfirmation, secondOutdatedRegistrationConfirmation,
    ]);

    // Act
    await handler();

    // Assert
    const registrationConfirmations: RegistrationConfirmation[] =
      await RegistrationConfirmationDatabaseUtils.getAllRegistrationConfirmations();

    expect(registrationConfirmations).to.be.an('array').that.is.empty;
  });

  it('should delete only outdated registration confirmations', async () => {
    // Arrange
    const outdatedRegistrationConfirmation: RegistrationConfirmation = new RegistrationConfirmationBuilder()
      .withAllowedConfirmationDate(DateUtils.getISODateWithOffset(-100_000).toISOString())
      .build();
    const activeRegistrationConfirmation: RegistrationConfirmation = new RegistrationConfirmationBuilder()
      .withAllowedConfirmationDate(DateUtils.getISODateWithOffset(100_000).toISOString())
      .build();

    await RegistrationConfirmationDatabaseUtils.saveRegistrationConfirmationsList([
      outdatedRegistrationConfirmation, activeRegistrationConfirmation,
    ]);

    // Act
    await handler();

    // Assert
    const registrationConfirmations: RegistrationConfirmation[] =
      await RegistrationConfirmationDatabaseUtils.getAllRegistrationConfirmations();

    expect(registrationConfirmations).to.be.an('array').length(1);
    expect(registrationConfirmations[0]).to.be.eql(activeRegistrationConfirmation);
  });

  const initEnvVariables = (): void => {
    process.env.ENVIRONMENT = process.env.MYSQL_PASSWORD || 'root';
    process.env.MYSQL_URL = process.env.MYSQL_URL || 'localhost';
    process.env.MYSQL_PORT = process.env.MYSQL_PORT || '3306';
    process.env.MYSQL_USERNAME = process.env.MYSQL_USERNAME || 'root';
    process.env.MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'compcar-test';
  };
});
