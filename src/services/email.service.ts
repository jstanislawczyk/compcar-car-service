import {Service} from 'typedi';
import {Email} from '../models/common/email/email';
import nodemailer, {Transporter} from 'nodemailer';
import {Options} from 'nodemailer/lib/smtp-transport';
import config from 'config';
import {Logger} from '../common/logger';
import {EmailSendingFailureError} from '../models/errors/email-sending-failure.error';

@Service()
export class EmailService {

  private readonly mailTransporter: Transporter;
  private readonly serviceEmail: string;

  constructor() {
    this.serviceEmail = config.get('email.auth.user');
    const host: string = config.get('email.host');
    const port: number = config.get('email.port');
    const transporterOptions: Options = config.get('common.environment') === 'production'
      ? {
        host,
        port,
        secure: config.get('email.secure'),
        auth: {
          user: this.serviceEmail,
          pass: config.get('email.auth.password'),
        },
      }
      : {
        host,
        port,
      };

    this.mailTransporter = nodemailer.createTransport(transporterOptions);
  }

  public async sendMail(email: Email): Promise<void> {
    const mailOptions = {
      from: this.serviceEmail,
      to: email.receiverAddress,
      subject: email.subject,
      text: email.text,
      html: email.html,
    };

    try {
      await this.mailTransporter.sendMail(mailOptions);
      Logger.log(`Email has been sent to ${email.receiverAddress} address`);
    } catch (error: any) {
      Logger.log(`Failed to send an email to ${email.receiverAddress} address. Reason: ${error.response}`);
      throw new EmailSendingFailureError(`Failed to send an email to ${email.receiverAddress} address`);
    }
  }
}
