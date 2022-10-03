import {expect, use} from 'chai';
import {Config} from './config';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import {SsmService} from '../services/ssm.service';
import sinonChai from 'sinon-chai';

use(sinonChai);

describe('Config', () => {

  const password: string = 'TestPassword123';

  let sandbox: SinonSandbox;
  let ssmServiceStub: SinonStubbedInstance<SsmService>;

  beforeEach(() => {
    (Config as any).instance = undefined;
    sandbox = sinon.createSandbox();

    ssmServiceStub = sandbox.createStubInstance(SsmService);

    ssmServiceStub.getParameter.onFirstCall().resolves(password);
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('getInstance', () => {
    it('should get default config', async () => {
      // Act
      const config: Config = await Config.getInstance(ssmServiceStub);

      // Assert
      expect(config).to.be.eql({
        mysql: {
          host: 'localhost',
          port: 3306,
          username: 'root',
          database: 'compcar',
          password,
        },
      });
      expect(ssmServiceStub.getParameter).to.be.calledOnceWith('test/MYSQL_PASSWORD');
    });

    it('should get config with env parameters', async () => {
      // Arrange
      const environment: string = 'TestEnv';
      const host: string = '127.0.0.1';
      const port: number = 3307;
      const username: string = 'user';
      const database: string = 'compcar-test';

      process.env.ENVIRONMENT = environment;
      process.env.MYSQL_URL = host;
      process.env.MYSQL_PORT = port.toString();
      process.env.MYSQL_USERNAME = username;
      process.env.MYSQL_DATABASE = database;

      // Act
      const config: Config = await Config.getInstance(ssmServiceStub);

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
      expect(ssmServiceStub.getParameter).to.be.calledOnceWith(`${environment}/MYSQL_PASSWORD`);
    });

    it('should init instance only once', async () => {
      // Arrange
      ssmServiceStub.getParameter.resolves('password');

      // Act
      const config: Config = await Config.getInstance(ssmServiceStub);
      const secondConfig: Config = await Config.getInstance(ssmServiceStub);

      // Assert
      expect(config).to.be.equal(secondConfig);
      expect(ssmServiceStub.getParameter).to.be.calledOnce;
    });
  });
});
