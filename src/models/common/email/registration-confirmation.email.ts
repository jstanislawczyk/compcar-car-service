import {Email} from './email';
import {User} from '../../entities/user';

export class RegistrationConfirmationEmail extends Email {

  constructor(user: User) {
    const subject: string = 'Email registration';
    const date: string = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'full',
      timeStyle: 'long',
    }).format(Date.parse(user.registerDate));
    const html: string = `
      <h1>Thank you for registering</h1>
      <p>Please log in using your email <b>${user.email}</b></p>
      <p>Registration date: ${date}</p>
    `;
    const text: string =
      `Thank you for registering. Please log in using your email ${user.email}.\n` +
      `Registration date: ${date}`;

    super(user.email, subject, html, text);
  }
}
