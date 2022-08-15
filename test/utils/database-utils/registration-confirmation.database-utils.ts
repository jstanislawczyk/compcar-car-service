import {getRepository, MoreThan, Repository} from 'typeorm';
import {RegistrationConfirmation} from '../../../src/models/entities/registration-confirmation';
import {FindOneOptions} from 'typeorm/find-options/FindOneOptions';

export class RegistrationConfirmationDatabaseUtils {

  public static getAllRegistrationConfirmations(): Promise<RegistrationConfirmation[]> {
    return this.getRegistrationConfirmationRepository().find();
  }

  public static getRegistrationConfirmationById(
    id: number,
    options: FindOneOptions<RegistrationConfirmation> = {},
  ): Promise<RegistrationConfirmation | undefined> {
    return this.getRegistrationConfirmationRepository().findOne({ id }, options);
  }

  public static getRegistrationConfirmationByIdOrFail(
    id: number,
    options: FindOneOptions<RegistrationConfirmation> = {},
  ): Promise<RegistrationConfirmation> {
    return this.getRegistrationConfirmationRepository().findOneOrFail({ id }, options);
  }

  public static saveRegistrationConfirmation(
    registrationConfirmation: RegistrationConfirmation,
  ): Promise<RegistrationConfirmation> {
    return this.getRegistrationConfirmationRepository().save(registrationConfirmation);
  }

  public static saveRegistrationConfirmationsList(
    registrationConfirmations: RegistrationConfirmation[],
  ): Promise<RegistrationConfirmation[]> {
    return this.getRegistrationConfirmationRepository().save(registrationConfirmations);
  }

  public static async deleteAllRegistrationConfirmations(): Promise<void> {
    const numberOfRegistrationConfirmations: number = await this.countRegistrationConfirmations();

    if (numberOfRegistrationConfirmations > 0) {
      await this.getRegistrationConfirmationRepository().delete({
        id: MoreThan(0),
      });
    }
  }

  public static async countRegistrationConfirmations(): Promise<number> {
    return this.getRegistrationConfirmationRepository().count();
  }

  private static getRegistrationConfirmationRepository(): Repository<RegistrationConfirmation> {
    return getRepository(RegistrationConfirmation);
  }
}
