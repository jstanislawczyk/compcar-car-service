import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {NotFoundError} from '../models/errors/not-found.error';
import {EngineRepository} from '../repositories/engine.repository';
import {EngineService} from './engine.service';
import {EngineBuilder} from '../../test/utils/builders/engine.builder';
import {Engine} from '../models/entities/engine';

use(sinonChai);
use(chaiAsPromised);

context('EngineService', () => {

  let sandbox: SinonSandbox;
  let engineRepositoryStub: SinonStubbedInstance<EngineRepository>;
  let engineService: EngineService;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    engineRepositoryStub = sandbox.createStubInstance(EngineRepository);
    engineService = new EngineService(engineRepositoryStub);

    engineRepositoryStub.findOne.resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findOne', () => {
    it('should find engine by id', async () => {
      // Arrange
      const engineId: number = 1;
      const existingEngine: Engine = new EngineBuilder()
          .withId(engineId)
          .build();

      engineRepositoryStub.findOneOrFail.resolves(existingEngine);

      // Act
      const returnedEngine: Engine = await engineService.findOne(engineId);

      // Assert
      expect(returnedEngine).to.be.eql(existingEngine);
      expect(engineRepositoryStub.findOneOrFail).to.be.calledOnceWith(engineId);
    });

    it("should throw error if engine doesn't exist", async () => {
      // Arrange
      const engineId: number = 1;

      engineRepositoryStub.findOneOrFail.rejects(new Error('Not Found'));

      // Act
      const returnedEngineResult: Promise<Engine> = engineService.findOne(engineId);

      // Assert
      await expect(returnedEngineResult).to.eventually
          .be.rejectedWith(`Engine with id=${engineId} not found`)
          .and.to.be.an.instanceOf(NotFoundError);
      expect(engineRepositoryStub.findOneOrFail).to.be.calledOnceWith(engineId);
    });
  });
});
