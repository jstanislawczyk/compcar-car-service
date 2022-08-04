import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {Engine} from '../models/entities/engine';
import {EngineResolver} from './engine.resolver';
import {EngineBuilder} from '../../test/utils/builders/engine.builder';
import {EngineService} from '../services/engine.service';

use(sinonChai);
use(chaiAsPromised);

context('EngineResolver', () => {

  let sandbox: SinonSandbox;
  let engineServiceStub: SinonStubbedInstance<EngineService>;
  let engineResolver: EngineResolver;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    engineServiceStub = sandbox.createStubInstance(EngineService);

    engineResolver = new EngineResolver(engineServiceStub);
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('getEngineById', () => {
    it('should find engine by id', async () => {
      // Arrange
      const engineId: number = 1;
      const existingEngine: Engine = new EngineBuilder()
          .withId(engineId)
          .build();

      engineServiceStub.findOne.resolves(existingEngine);

      // Act
      const returnedEngine: Engine = await engineResolver.getEngineById(engineId);

      // Assert
      expect(returnedEngine).to.be.eql(existingEngine);
      expect(engineServiceStub.findOne).to.be.calledOnceWith(engineId);
    });

    it('should rethrow error from service', async () => {
      // Arrange
      const engineId: number = 1;

      engineServiceStub.findOne.rejects(new Error('Not Found'));

      // Act
      const returnedEngineResult: Promise<Engine> = engineResolver.getEngineById(engineId);

      // Assert
      await expect(returnedEngineResult).to.eventually
          .be.rejectedWith('Not Found')
          .and.to.be.an.instanceOf(Error);
      expect(engineServiceStub.findOne).to.be.calledOnceWith(engineId);
    });
  });
});
