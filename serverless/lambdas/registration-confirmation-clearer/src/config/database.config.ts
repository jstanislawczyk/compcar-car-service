import {DataSource} from 'typeorm';
import {Config} from './config';

export class DatabaseConfig {

  public static dataSource: DataSource;

  public static async initDataSource(config: Config): Promise<DataSource> {
    console.log('Initializing database config');

    if (!DatabaseConfig.dataSource) {
      console.log('Preparing new database config');

      const dataSourceConfig: DataSource = new DataSource({
        type: 'mysql',
        host: config.mysql.host,
        port: config.mysql.port,
        username: config.mysql.username,
        password: config.mysql.password,
        database: config.mysql.database,
        entities: [
          `${__dirname}/../../build/models/entities/*.js`,
          `${__dirname}/../../models/entities/*.ts`,
        ],
      });

      DatabaseConfig.dataSource = await dataSourceConfig.initialize();
    }

    console.log('Database config loaded');

    return DatabaseConfig.dataSource;
  }
}
