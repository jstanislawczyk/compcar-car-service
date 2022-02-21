import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {ModelFacade} from './model.facade';
import {ModelService} from '../services/model.service';
import {ModelsWithCountOutput} from '../models/object-types/car/models-with-count-output';
import {PaginationOptions} from '../models/common/filters/paginationOptions';
import {Model} from '../models/entities/model';
import {ModelBuilder} from '../../test/utils/builders/model.builder';

use(sinonChai);
use(chaiAsPromised);

context('ModelFacade', () => {

  let sandbox: SinonSandbox;
  let modelServiceStub: SinonStubbedInstance<ModelService>;
  let modelFacade: ModelFacade;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    modelServiceStub = sandbox.createStubInstance(ModelService);

    modelFacade = new ModelFacade(
        modelServiceStub as unknown as ModelService,
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findAllWithCount', () => {
    it('should find models with count', async () => {
      // Arrange
      const paginationOptions: PaginationOptions = {
        skip: 0,
        take: 10,
      };
      const models: Model[] = [
        new ModelBuilder().build(),
        new ModelBuilder(true).build(),
      ];
      const count: number = models.length;
      const existingModelsWithCount: ModelsWithCountOutput = {
        models,
        count,
      };

      modelServiceStub.findAllWithCount.resolves(existingModelsWithCount);

      // Act
      const modelsWithCountOutput: ModelsWithCountOutput = await modelFacade.findAllWithCount(paginationOptions);

      // Assert
      expect(modelsWithCountOutput).to.be.eql(existingModelsWithCount);
      expect(modelServiceStub.findAllWithCount).to.be.calledOnceWith(paginationOptions);
    });

    it('should rethrow error from findAllWithCount ModelService method', async () => {
      // Arrange
      const paginationOptions: PaginationOptions = {
        skip: 0,
        take: 10,
      };

      modelServiceStub.findAllWithCount.rejects(new Error('FindAllWithCount Error'));

      // Act
      const modelsWithCountResult: Promise<ModelsWithCountOutput> = modelFacade.findAllWithCount(paginationOptions);

      // Assert
      await expect(modelsWithCountResult).to.eventually
          .be.rejectedWith('FindAllWithCount Error')
          .and.to.be.an.instanceOf(Error);
      expect(modelServiceStub.findAllWithCount).to.be.calledOnceWith(paginationOptions);
    });
  });
});
