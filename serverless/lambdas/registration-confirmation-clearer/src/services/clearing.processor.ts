import {RegistrationConfirmationService} from './registration-confirmation.service';
import {DeleteResult} from 'typeorm';

export class ClearingProcessor {

  constructor(
    private readonly registrationConfirmationService: RegistrationConfirmationService,
  ) {
  }

  public async clear(): Promise<void> {
    try {
      const result: DeleteResult = await this.registrationConfirmationService.deleteOutdatedRegistrationConfirmations();
      console.log(`Outdated registration confirmations deleted. Deleted ${result.affected} entries`);
    } catch (error: any) {
      console.log(`Deleting registration confirmations failed. Error: ${error}`);
      throw error;
    }
  }
}
