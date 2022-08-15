import sinonChai from 'sinon-chai';
import {expect, use} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createSandbox, SinonSandbox, SinonStub} from 'sinon';
import {Config} from './config/config';
import {DatabaseConfig} from './config/database.config';
import {ClearingProcessor} from './services/clearing.processor';
import {handler} from './index';
import {DataSource, Repository} from 'typeorm';

use(sinonChai);
use(chaiAsPromised);

describe('Index', () => {

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
  let configGetInstanceStub: SinonStub;
  let databaseConfigInitDataSourceStub: SinonStub;
  let clearingProcessorClearStub: SinonStub;

  beforeEach(() => {
    sandbox = createSandbox();

    configGetInstanceStub = sandbox.stub(Config, 'getInstance');
    databaseConfigInitDataSourceStub = sandbox.stub(DatabaseConfig, 'initDataSource');
    clearingProcessorClearStub = sandbox.stub(ClearingProcessor.prototype, 'clear');

    configGetInstanceStub.returns(config);
    databaseConfigInitDataSourceStub.resolves(dataSource);
    clearingProcessorClearStub.resolves();
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('clear', () => {
    it('should clear outdated registration confirmations', async () => {
      // Act
      await handler();

      // Assert
      expect(configGetInstanceStub).to.be.calledOnce;
      expect(databaseConfigInitDataSourceStub).to.be.calledOnceWith(config);
      expect(clearingProcessorClearStub).to.be.calledOnce;
    });

    describe('should rethrow error', () => {
      it('from TestDatabaseConfig', async () => {
        // Arrange
        const errorMessage: string = 'DataSource error';

        databaseConfigInitDataSourceStub.rejects(new Error(errorMessage));

        // Act
        const result: Promise<void> = handler();

        // Assert
        await expect(result).to.eventually
          .be.rejectedWith(errorMessage)
          .and.to.be.an.instanceOf(Error);
        expect(configGetInstanceStub).to.be.calledOnce;
        expect(databaseConfigInitDataSourceStub).to.be.calledOnce;
        expect(clearingProcessorClearStub).to.be.not.called;
      });

      it('from ClearingProcessor clear method', async () => {
        // Arrange
        const errorMessage: string = 'ClearingProcessor error';

        clearingProcessorClearStub.rejects(new Error(errorMessage));

        // Act
        const result: Promise<void> = handler();

        // Assert
        await expect(result).to.eventually
          .be.rejectedWith(errorMessage)
          .and.to.be.an.instanceOf(Error);
        expect(configGetInstanceStub).to.be.calledOnce;
        expect(databaseConfigInitDataSourceStub).to.be.calledOnce;
        expect(clearingProcessorClearStub).to.be.calledOnce;
      });
    });
  });
});
