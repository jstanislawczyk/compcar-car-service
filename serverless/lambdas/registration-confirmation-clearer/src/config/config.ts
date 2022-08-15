import {DatabaseConnection} from '../models/common/database-connection';

export class Config {

  private static instance: Config;

  private constructor(
    public readonly mysql: DatabaseConnection,
  ) {}

  public static getInstance(): Config {
    console.log('Initializing config');

    if (!Config.instance) {
      console.log('Preparing new config');

      Config.instance = new Config({
        host: process.env.MYSQL_URL || 'localhost',
        port: Number(process.env.MYSQL_PORT) || 3306,
        username: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || 'root',
        database: process.env.MYSQL_DATABASE || 'compcar',
      });
    }

    console.log('Config loaded');

    return Config.instance;
  }
}
