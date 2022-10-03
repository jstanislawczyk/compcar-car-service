import {expect} from 'chai';
import {Config} from './config';
import {DatabaseConfig} from './database.config';
import {DataSource, Repository} from 'typeorm';
import sinon, {SinonSandbox, SinonStub} from 'sinon';

describe('DatabaseConfig', () => {

  const config: Config = {
    mysql: {
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'compcar',
    },
  };
  const dataSource: Partial<DataSource> = {
    isInitialized: true,
    getRepository: () => ({} as Repository<any>),
  };

  let sandbox: SinonSandbox;
  let dataSourceInitializeStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    dataSourceInitializeStub = sandbox.stub(DataSource.prototype, 'initialize');
    dataSourceInitializeStub.resolves(dataSource);

    (DatabaseConfig as any).dataSource = undefined;
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('initDataSource', () => {
    it('should init database config', async () => {
      // Act
      const returnedDataSource: DataSource = await DatabaseConfig.initDataSource(config);

      // Assert
      expect(returnedDataSource).to.be.eql(dataSource);
      expect(dataSourceInitializeStub).to.be.calledOnce;
    });

    it('should init instance only once', async () => {
      // Act
      const dataSource: DataSource = await DatabaseConfig.initDataSource(config);
      const secondDataSource: DataSource = await DatabaseConfig.initDataSource(config);

      // Assert
      expect(dataSource).to.be.equal(secondDataSource);
    });

    describe('should rethrow error', () => {
      it('from DataSource init method', async () => {
        // Arrange
        const errorMessage: string = 'DataSource error';

        dataSourceInitializeStub.rejects(new Error(errorMessage));

        // Act
        const returnedDataSourceResult: Promise<DataSource> = DatabaseConfig.initDataSource(config);

        // Assert
        await expect(returnedDataSourceResult).to.eventually
          .be.rejectedWith(errorMessage)
          .and.to.be.an.instanceOf(Error);
        expect(dataSourceInitializeStub).to.be.calledOnce;
      });
    });
  });
});
