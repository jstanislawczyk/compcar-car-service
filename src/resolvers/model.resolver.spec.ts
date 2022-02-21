import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {ModelResolver} from './model.resolver';
import {ModelFacade} from '../facades/model.facade';
import {PaginationMapper} from '../mapper/pagination.mapper';
import {PaginationOptions} from '../models/common/filters/paginationOptions';
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

    modelResolver = new ModelResolver(
      modelFacadeStub as ModelFacade,
      paginationMapperStub as PaginationMapper,
    );
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
      modelFacadeStub.findAllWithCount.resolves(existingModelsWithCount);

      // Act
      const modelsWithCountOutput: ModelsWithCountOutput = await modelResolver.getModelsWithCount(paginationInput);

      // Assert
      expect(modelsWithCountOutput).to.be.eql(existingModelsWithCount);
      expect(modelFacadeStub.findAllWithCount).to.be.calledOnceWith(paginationOptions);
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
      modelFacadeStub.findAllWithCount.rejects(new Error('FindAllWithCount error'));

      // Act
      const returnedModelsWithCountOutputResult: Promise<ModelsWithCountOutput> =
          modelResolver.getModelsWithCount(paginationInput);

      // Assert
      await expect(returnedModelsWithCountOutputResult).to.eventually
          .be.rejectedWith('FindAllWithCount error')
          .and.to.be.an.instanceOf(Error);
      expect(modelFacadeStub.findAllWithCount).to.be.calledOnceWith(paginationOptions);
    });
  });
});
