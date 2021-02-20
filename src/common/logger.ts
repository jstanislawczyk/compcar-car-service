import {LoggerLevel} from '../enums/logger-level';
import winston, {Logger as WinstonLogger, LoggerOptions} from 'winston';

export class Logger {

  private static logger: WinstonLogger;

  public static log(message: string, level: LoggerLevel = LoggerLevel.INFO): void {
    if (!this.logger) {
      this.initLogger();
    }

    this.logger.log(
      level,
      message,
    );
  }

  private static initLogger(): void {
    const loggerOptions: LoggerOptions = {
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.label({
              label: '[GraphQlTraining]',
            }),
            winston.format.printf(({ label, message }) =>
              `${label} ${message}`
            ),
            winston.format.colorize({
              all: true,
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.timestamp(),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.timestamp(),
        }),
      ],
    };

   this.logger = winston.createLogger(loggerOptions);
  }
}
