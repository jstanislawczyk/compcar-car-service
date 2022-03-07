import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {ModelRepository} from '../repositories/model.repository';
import {ModelService} from './model.service';
import {ModelBuilder} from '../../test/utils/builders/model.builder';
import {ModelsWithCountOutput} from '../models/object-types/car/models-with-count-output';
import {PaginationOptions} from '../models/common/filters/paginationOptions';
import {Model} from '../models/entities/model';
import {NotFoundError} from '../models/errors/not-found.error';

use(sinonChai);
use(chaiAsPromised);

context('ModelService', () => {

  let sandbox: SinonSandbox;
  let modelRepositoryStub: SinonStubbedInstance<ModelRepository>;
  let modelService: ModelService;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    modelRepositoryStub = sandbox.createStubInstance(ModelRepository);
    modelService = new ModelService(modelRepositoryStub);

    modelRepositoryStub.findOneOrFail.resolves(new ModelBuilder().build());
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findAllWithCount', () => {
    it('should get models list with count', async () => {
      // Arrange
      const modelsList: Model[] = [
        new ModelBuilder().build(),
        new ModelBuilder(true).build(),
      ];
      const count: number = modelsList.length;
      const modelsWithCount: [Model[], number] = [modelsList, count];
      const paginationOptions: PaginationOptions = {
        skip: 0,
        take: 10,
      };

      modelRepositoryStub.findAndCount.resolves(modelsWithCount);

      // Act
      const modelsWithCountResult: ModelsWithCountOutput = await modelService.findAllWithCount(paginationOptions);

      // Assert
      expect(modelsWithCountResult.models).to.be.eql(modelsList);
      expect(modelsWithCountResult.count).to.be.eql(count);
      expect(modelRepositoryStub.findAndCount).to.be.calledOnceWith(paginationOptions);
    });

    it('should throw error', async () => {
      // Arrange
      const paginationOptions: PaginationOptions = {
        skip: 0,
        take: 10,
      };

      modelRepositoryStub.findAndCount.rejects(new Error('FindAndCount error'));

      // Act
      const modelsWithCountOutput: Promise<ModelsWithCountOutput> = modelService.findAllWithCount(paginationOptions);

      // Assert
      await expect(modelsWithCountOutput).to.eventually.be.rejectedWith('FindAndCount error');
    });
  });

  describe('findOne', () => {
    it('should find model by id', async () => {
      // Arrange
      const modelId: number = 1;
      const existingModel: Model = new ModelBuilder()
          .withId(modelId)
          .build();

      modelRepositoryStub.findOneOrFail.resolves(existingModel);

      // Act
      const returnedModel: Model = await modelService.findOne(modelId);

      // Assert
      expect(returnedModel).to.be.eql(existingModel);
      expect(modelRepositoryStub.findOneOrFail).to.be.calledOnceWith(modelId);
    });

    it("should throw error if model doesn't exist", async () => {
      // Arrange
      const modelId: number = 1;

      modelRepositoryStub.findOneOrFail.rejects(new Error('Not Found'));

      // Act
      const returnedModelResult: Promise<Model> = modelService.findOne(modelId);

      // Assert
      await expect(returnedModelResult).to.eventually
          .be.rejectedWith(`Model with id=${modelId} not found`)
          .and.to.be.an.instanceOf(NotFoundError);
      expect(modelRepositoryStub.findOneOrFail).to.be.calledOnceWith(modelId);
    });
  });
});
