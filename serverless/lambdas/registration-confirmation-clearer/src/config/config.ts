import {DatabaseConnection} from '../models/common/database-connection';
import {SsmService} from '../services/ssm.service';

export class Config {

  private static instance: Config;

  private constructor(
    public readonly mysql: DatabaseConnection,
  ) {}

  public static async getInstance(ssmService: SsmService): Promise<Config> {
    console.log('Initializing config');

    if (!Config.instance) {
      console.log('Preparing new config');

      const environment: string = process.env.ENVIRONMENT || 'test';
      const password: string | undefined = await ssmService.getParameter(`${environment}/MYSQL_PASSWORD`);

      Config.instance = new Config({
        host: process.env.MYSQL_URL || 'localhost',
        port: Number(process.env.MYSQL_PORT) || 3306,
        username: process.env.MYSQL_USERNAME || 'root',
        password: password || 'root',
        database: process.env.MYSQL_DATABASE || 'compcar',
      });
    }

    console.log('Config loaded');

    return Config.instance;
  }
}
