import {DeleteResult, LessThan, Repository} from 'typeorm';
import {RegistrationConfirmation} from '../models/entities/registration-confirmation';

export class RegistrationConfirmationService {

  constructor(
    private readonly registrationConfirmationRepository: Repository<RegistrationConfirmation>,
  ) {
  }

  public async deleteOutdatedRegistrationConfirmations(): Promise<DeleteResult> {
    const currentIsoDate: string = new Date().toISOString();

    return this.registrationConfirmationRepository.delete({
      allowedConfirmationDate: LessThan(currentIsoDate),
    });
  }
}
