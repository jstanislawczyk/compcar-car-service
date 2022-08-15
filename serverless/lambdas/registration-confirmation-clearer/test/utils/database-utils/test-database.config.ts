import {DataSource} from 'typeorm';

export class TestDatabaseConfig {

  public static dataSource: DataSource;

  public static async initDataSource(): Promise<DataSource> {
    console.log('Initializing database config');

    if (!TestDatabaseConfig.dataSource) {
      const isDev: boolean = process.env.IS_DEV === 'true';
      const dataSourceConfig: DataSource = new DataSource({
        type: 'mysql',
        host: process.env.MYSQL_URL || 'localhost',
        port: Number(process.env.MYSQL_PORT) || 3306,
        username: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || 'root',
        database: process.env.MYSQL_DATABASE || 'compcar-test',
        entities: [
          isDev
            ? 'src/models/entities/*.ts'
            : 'build/src/models/entities/*.js',
        ],
      });

      TestDatabaseConfig.dataSource = await dataSourceConfig.initialize();
    }

    console.log('Database config loaded');

    return TestDatabaseConfig.dataSource;
  }
}
