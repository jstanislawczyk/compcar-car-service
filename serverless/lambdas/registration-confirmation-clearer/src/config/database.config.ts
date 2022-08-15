import {DataSource} from 'typeorm';
import {Config} from './config';

export class DatabaseConfig {

  public static dataSource: DataSource;

  public static async initDataSource(config: Config): Promise<DataSource> {
    console.log('Initializing database config');

    if (!DatabaseConfig.dataSource) {
      console.log('Preparing new database config');

      const isDev: boolean = process.env.IS_DEV === 'true';
      const dataSourceConfig: DataSource = new DataSource({
        type: 'mysql',
        host: config.mysql.host,
        port: config.mysql.port,
        username: config.mysql.username,
        password: config.mysql.password,
        database: config.mysql.database,
        entities: [
          isDev
            ? 'src/models/entities/*.ts'
            : 'build/src/models/entities/*.js',
        ],
      });

      DatabaseConfig.dataSource = await dataSourceConfig.initialize();
    }

    console.log('Database config loaded');

    return DatabaseConfig.dataSource;
  }
}
