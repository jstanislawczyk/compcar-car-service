import {handler} from '../../src';
import { RegistrationConfirmation } from '../models/entities/registration-confirmation';
import {RegistrationConfirmationBuilder} from '../utils/builders/registration-confirmation.builder';
import {DateUtils} from '../common/date.utils';
import {RegistrationConfirmationDatabaseUtils} from '../utils/database-utils/registration-confirmation.database-utils';
import {expect} from 'chai';

describe('RegistrationConfirmationClearer', () => {

  before(() =>
    initEnvVariables()
  );

  beforeEach(() =>
    RegistrationConfirmationDatabaseUtils.deleteAllRegistrationConfirmations()
  );

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
    process.env.MYSQL_URL = process.env.MYSQL_URL || 'localhost';
    process.env.MYSQL_PORT = process.env.MYSQL_PORT || '3306';
    process.env.MYSQL_USERNAME = process.env.MYSQL_USERNAME || 'root';
    process.env.MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'root';
    process.env.MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'compcar-test';
  };
});
