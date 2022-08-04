import {Email} from './email';
import {User} from '../../entities/user';
import {RegistrationConfirmation} from '../../entities/registration-confirmation';
import config from 'config';
import {DateUtils} from '../../../common/date.utils';

export class RegistrationConfirmationEmail extends Email {

  constructor(user: User, registrationConfirmation: RegistrationConfirmation) {
    const subject: string = 'Email registration';
    const frontendUrl: string = config.get('services.frontend.url');
    const confirmationLink = `${frontendUrl}/register/confirmation/${registrationConfirmation.code}`;
    const registrationDate: string = DateUtils.formatISODateToReadableFormat(user.registerDate);
    const allowedConfirmationDate: string = DateUtils.formatISODateToReadableFormat(
      registrationConfirmation.allowedConfirmationDate,
    );

    const html: string = `
      <h1>Thank you for registering</h1>
      <p>Please activate your email <a href="${confirmationLink}" target="_blank">${confirmationLink}</a>.</p>
      <p>Confirmation email will be active until: ${allowedConfirmationDate}.</p>
      <p>Registration date: ${registrationDate}</p><br />
      <p>Thanks & regards</p>
      <p>Compcar team</p>
    `;
    const text: string =
      `Thank you for registering. Please activate your email ${confirmationLink}.\n` +
      `Confirmation email will be active until: ${allowedConfirmationDate}\n.` +
      `Registration date: ${registrationDate}\n` +
      `Thanks & regards` +
      `Compcar team`;

    super(user.email, subject, html, text);
  }
}
