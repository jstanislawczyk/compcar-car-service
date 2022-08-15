import {DataSource, MoreThan, Repository} from 'typeorm';
import {RegistrationConfirmation} from '../../../src/models/entities/registration-confirmation';
import {TestDatabaseConfig} from './test-database.config';

export class RegistrationConfirmationDatabaseUtils {

  public static async getAllRegistrationConfirmations(): Promise<RegistrationConfirmation[]> {
    return (await this.getRegistrationConfirmationRepository()).find();
  }

  public static async getRegistrationConfirmationById(id: number): Promise<RegistrationConfirmation | undefined> {
    return (await this.getRegistrationConfirmationRepository()).findOneByOrFail({ id });
  }

  public static async getRegistrationConfirmationByIdOrFail(id: number): Promise<RegistrationConfirmation> {
    return (await this.getRegistrationConfirmationRepository()).findOneByOrFail({ id });
  }

  public static async saveRegistrationConfirmation(
    registrationConfirmation: RegistrationConfirmation,
  ): Promise<RegistrationConfirmation> {
    return (await this.getRegistrationConfirmationRepository()).save(registrationConfirmation);
  }

  public static async saveRegistrationConfirmationsList(
    registrationConfirmations: RegistrationConfirmation[],
  ): Promise<RegistrationConfirmation[]> {
    return (await this.getRegistrationConfirmationRepository()).save(registrationConfirmations);
  }

  public static async deleteAllRegistrationConfirmations(): Promise<void> {
    const numberOfRegistrationConfirmations: number = await this.countRegistrationConfirmations();

    if (numberOfRegistrationConfirmations > 0) {
      await (await this.getRegistrationConfirmationRepository()).delete({
        id: MoreThan(0),
      });
    }
  }

  public static async countRegistrationConfirmations(): Promise<number> {
    return (await this.getRegistrationConfirmationRepository()).count();
  }

  private static async getRegistrationConfirmationRepository(): Promise<Repository<RegistrationConfirmation>> {
    const dataSource: DataSource = await TestDatabaseConfig.initDataSource();

    return dataSource.getRepository(RegistrationConfirmation);
  }
}
