import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {expect} from 'chai';
import {CommonDatabaseUtils} from '../utils/database-utils/common.database-utils';
import {ModelDatabaseUtils} from '../utils/database-utils/model.database-utils';
import {Model} from '../../src/models/entities/model';
import {ModelBuilder} from '../utils/builders/model.builder';
import {ModelsWithCountOutput} from '../../src/models/object-types/car/models-with-count-output';
import {ResponseError} from '../utils/interfaces/response-error';

describe('Model', () => {

  before(async () =>
    await CommonDatabaseUtils.deleteAllEntities()
  );

  beforeEach(async () =>
    await ModelDatabaseUtils.deleteAllModels()
  );

  describe('getModelsWithCount', () => {
    it('should get models with count', async () => {
      // Arrange
      const modelsList: Model[] = [
        new ModelBuilder().build(),
        new ModelBuilder()
          .withName('80')
          .withDescription('Old car')
          .build(),
      ];
      const query: string = `
        {
          getModelsWithCount(
            pagination: {
              pageNumber: 1,
              pageSize: 10,
            },
          ) {
            models {
              id,
              name,
              description,
            },
            count,
          }
        }
      `;

      await ModelDatabaseUtils.saveModelsList(modelsList);

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const returnedModelsWithCount: ModelsWithCountOutput = response.body.data.getModelsWithCount as ModelsWithCountOutput;
      const models: Model[] = returnedModelsWithCount.models;

      expect(Number(models[0].id)).to.be.above(0);
      expect(models[0].name).to.be.eql('A4');
      expect(models[0].description).to.be.eql('German limousine');
      expect(Number(models[1].id)).to.be.above(0);
      expect(models[1].name).to.be.eql('80');
      expect(models[1].description).to.be.eql('Old car');
      expect(returnedModelsWithCount.count).to.be.eql(2);
      expect(returnedModelsWithCount.count).to.be.eql(returnedModelsWithCount.models.length);
    });

    it('should get paginated models with count', async () => {
      // Arrange
      const modelsList: Model[] = [
        new ModelBuilder().build(),
        new ModelBuilder()
            .withName('80')
            .withDescription('Old car')
            .build(),
        new ModelBuilder()
            .withName('A3')
            .withDescription('Small car')
            .build(),
      ];
      const query: string = `
        {
          getModelsWithCount(
            pagination: {
              pageNumber: 2,
              pageSize: 2,
            },
          ) {
            models {
              id,
              name,
              description,
            },
            count,
          }
        }
      `;

      await ModelDatabaseUtils.saveModelsList(modelsList);

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const returnedModelsWithCount: ModelsWithCountOutput = response.body.data.getModelsWithCount as ModelsWithCountOutput;
      const models: Model[] = returnedModelsWithCount.models;

      expect(Number(models[0].id)).to.be.above(0);
      expect(models[0].name).to.be.eql('A3');
      expect(models[0].description).to.be.eql('Small car');
      expect(returnedModelsWithCount.models.length).to.be.eql(1);
      expect(returnedModelsWithCount.count).to.be.eql(modelsList.length);
    });
  });

  describe('getModelById', () => {
    it('should get model by id', async () => {
      // Arrange
      const model: Model = new ModelBuilder(true)
        .withName('B6')
        .withDescription('Test description')
        .build();
      const savedModel: Model = await ModelDatabaseUtils.saveModel(model);

      const query: string = `
        {
          getModelById(id: ${savedModel.id}) {
            id,
            name,
            description,
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({ query })
          .expect(200);

      const returnedModelResponse: Model = response.body.data.getModelById as Model;
      expect(Number(returnedModelResponse.id)).to.be.above(0);
      expect(returnedModelResponse.name).to.be.eql('B6');
      expect(returnedModelResponse.description).to.be.eql('Test description');
      expect(returnedModelResponse.brand).to.be.undefined;
      expect(returnedModelResponse.generations).to.be.undefined;

      const existingModel: Model = await ModelDatabaseUtils.getModelByIdOrFail(
        Number(returnedModelResponse.id)
      );
      expect(returnedModelResponse.id).to.be.be.eql(existingModel.id?.toString());
      expect(returnedModelResponse.name).to.be.be.eql(existingModel.name);
      expect(returnedModelResponse.description).to.be.be.eql(existingModel.description);
    });

    it("should throw error if model doesn't exist", async () => {
      // Arrange
      const notExistingModelId: number = 0;
      const query: string = `
        {
          getModelById(id: ${notExistingModelId}) {
            id,
            name,
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const error: ResponseError = response.body.errors[0];
      expect(error.message).to.be.eql(`Model with id=${notExistingModelId} not found`);
      expect(error.extensions.code).to.be.eql('NOT_FOUND');
    });
  });
});
