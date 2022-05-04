import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {ModelResolver} from './model.resolver';
import {ModelFacade} from '../facades/model.facade';
import {PaginationMapper} from '../mapper/pagination.mapper';
import {PaginationOptions} from '../models/common/filters/pagination-options';
import {PaginationInput} from '../models/inputs/pagination/pagination.input';
import {Model} from '../models/entities/model';
import {ModelBuilder} from '../../test/utils/builders/model.builder';
import {ModelsWithCountOutput} from '../models/object-types/car/models-with-count-output';

use(sinonChai);
use(chaiAsPromised);

context('ModelResolver', () => {

  let sandbox: SinonSandbox;
  let modelFacadeStub: SinonStubbedInstance<ModelFacade>;
  let paginationMapperStub: SinonStubbedInstance<PaginationMapper>;
  let modelResolver: ModelResolver;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    modelFacadeStub = sandbox.createStubInstance(ModelFacade);
    paginationMapperStub = sandbox.createStubInstance(PaginationMapper);

    modelResolver = new ModelResolver(modelFacadeStub, paginationMapperStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getModelsWithCount', () => {
    it('should find models with count', async () => {
      // Arrange
      const paginationInput: PaginationInput = {
        pageSize: 10,
        pageNumber: 1,
      };
      const paginationOptions: PaginationOptions = {
        take: 10,
        skip: 0,
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

      paginationMapperStub.toPaginationOptions.returns(paginationOptions);
      modelFacadeStub.findAllModelsWithCount.resolves(existingModelsWithCount);

      // Act
      const modelsWithCountOutput: ModelsWithCountOutput = await modelResolver.getModelsWithCount(paginationInput);

      // Assert
      expect(modelsWithCountOutput).to.be.eql(existingModelsWithCount);
      expect(modelFacadeStub.findAllModelsWithCount).to.be.calledOnceWith(paginationOptions);
    });

    it('should rethrow error from facade', async () => {
      // Arrange
      const paginationInput: PaginationInput = {
        pageSize: 10,
        pageNumber: 1,
      };
      const paginationOptions: PaginationOptions = {
        take: 10,
        skip: 0,
      };

      paginationMapperStub.toPaginationOptions.returns(paginationOptions);
      modelFacadeStub.findAllModelsWithCount.rejects(new Error('FindAllWithCount error'));

      // Act
      const returnedModelsWithCountOutputResult: Promise<ModelsWithCountOutput> =
          modelResolver.getModelsWithCount(paginationInput);

      // Assert
      await expect(returnedModelsWithCountOutputResult).to.eventually
          .be.rejectedWith('FindAllWithCount error')
          .and.to.be.an.instanceOf(Error);
      expect(modelFacadeStub.findAllModelsWithCount).to.be.calledOnceWith(paginationOptions);
    });
  });

  describe('getModelById', () => {
    it('should find model by id', async () => {
      // Arrange
      const modelId: number = 1;
      const existingModel: Model = new ModelBuilder()
          .withId(modelId)
          .build();

      modelFacadeStub.findModelById.resolves(existingModel);

      // Act
      const returnedModel: Model = await modelResolver.getModelById(modelId);

      // Assert
      expect(returnedModel).to.be.eql(existingModel);
      expect(modelFacadeStub.findModelById).to.be.calledOnceWith(modelId);
    });

    it('should rethrow error from facade', async () => {
      // Arrange
      const modelId: number = 1;

      modelFacadeStub.findModelById.rejects(new Error('Not Found'));

      // Act
      const returnedModelResult: Promise<Model> = modelResolver.getModelById(modelId);

      // Assert
      await expect(returnedModelResult).to.eventually
          .be.rejectedWith('Not Found')
          .and.to.be.an.instanceOf(Error);
      expect(modelFacadeStub.findModelById).to.be.calledOnceWith(modelId);
    });
  });
});
