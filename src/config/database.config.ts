import {ConnectionOptions} from 'typeorm';
import config from 'config';

export class DatabaseConfig {

  public static getDatabaseConnectionConfiguration(): ConnectionOptions {
    const isDev: boolean = config.get('common.isDev');

    return <ConnectionOptions> {
      type: 'mysql',
      synchronize: true,
      host: config.get('mysql.url'),
      port: config.get('mysql.port'),
      username: config.get('mysql.username'),
      password: config.get('mysql.password'),
      database: config.get('mysql.database'),
      logging: config.get('mysql.logging'),
      entities: [
        isDev
          ? 'src/models/**/*.ts'
          : 'build/src/models/**/*.js',
      ],
      migrations: [
        isDev
          ? 'src/migration/**/*.ts'
          : 'build/src/migration/**/*.js',
      ],
      subscribers: [
        isDev
          ? 'src/subscriber/**/*.ts'
          : 'build/src/subscriber/**/*.js',
      ],
      cli: {
        entitiesDir: 'src/models',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
      },
      useUnifiedTopology: true,
    };
  }
}
