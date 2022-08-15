import {expect} from 'chai';
import {Config} from './config';

describe('Config', () => {

  beforeEach(() =>
    (Config as any).instance = undefined
  );

  describe('getInstance', () => {
    it('should get default config', () => {
      // Act
      const config: Config = Config.getInstance();

      // Assert
      expect(config).to.be.eql({
        mysql: {
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'root',
          database: 'compcar',
        },
      });
    });

    it('should get config with env parameters', () => {
      // Arrange
      const host: string = '127.0.0.1';
      const port: number = 3307;
      const username: string = 'user';
      const password: string = 'password';
      const database: string = 'compcar-test';

      process.env.MYSQL_URL = host;
      process.env.MYSQL_PORT = port.toString();
      process.env.MYSQL_USERNAME = username;
      process.env.MYSQL_PASSWORD = password;
      process.env.MYSQL_DATABASE = database;

      // Act
      const config: Config = Config.getInstance();

      // Assert
      expect(config).to.be.eql({
        mysql: {
          host,
          port,
          username,
          password,
          database,
        },
      });
    });

    it('should init instance only once', () => {
      // Act
      const config: Config = Config.getInstance();
      const secondConfig: Config = Config.getInstance();

      // Assert
      expect(config).to.be.equal(secondConfig);
    });
  });
});
