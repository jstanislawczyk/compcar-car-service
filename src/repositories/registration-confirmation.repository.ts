import {EntityRepository, Repository} from 'typeorm';
import {RegistrationConfirmation} from '../models/entities/registration-confirmation';

@EntityRepository(RegistrationConfirmation)
export class RegistrationConfirmationRepository extends Repository<RegistrationConfirmation> {

}
