import 'reflect-metadata';

import {Config} from './config/config';
import {DatabaseConfig} from './config/database.config';
import {RegistrationConfirmationService} from './services/registration-confirmation.service';
import {ClearingProcessor} from './services/clearing.processor';
import {RegistrationConfirmation} from './models/entities/registration-confirmation';
import {DataSource, Repository} from 'typeorm';

export const handler = async (): Promise<void> => {
  console.log('Starting clearing');

  const config: Config = Config.getInstance();
  const dataSource: DataSource = await DatabaseConfig.initDataSource(config);

  const registrationConfirmationRepository: Repository<RegistrationConfirmation> =
    dataSource.getRepository(RegistrationConfirmation);
  const registrationConfirmationService: RegistrationConfirmationService = new RegistrationConfirmationService(
    registrationConfirmationRepository,
  );
  const clearingProcessor: ClearingProcessor = new ClearingProcessor(registrationConfirmationService);

  await clearingProcessor.clear();
};
