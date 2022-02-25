import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {expect} from 'chai';
import {CommonDatabaseUtils} from '../utils/database-utils/common.database-utils';
import {ModelDatabaseUtils} from '../utils/database-utils/model.database-utils';
import {Model} from '../../src/models/entities/model';
import {ModelBuilder} from '../utils/builders/model.builder';
import {ModelsWithCountOutput} from '../../src/models/object-types/car/models-with-count-output';

describe('Model', () => {

  before(async () => {
    await CommonDatabaseUtils.deleteAllEntities();
  });

  beforeEach(async () => {
    await ModelDatabaseUtils.deleteAllModels();
  });

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

      const returnedModelsWithCountOutput: ModelsWithCountOutput = response.body.data.getModelsWithCount as ModelsWithCountOutput;
      const models: Model[] = returnedModelsWithCountOutput.models;

      expect(Number(models[0].id)).to.be.above(0);
      expect(models[0].name).to.be.eql('A4');
      expect(models[0].description).to.be.eql('German limousine');
      expect(Number(models[1].id)).to.be.above(0);
      expect(models[1].name).to.be.eql('80');
      expect(models[1].description).to.be.eql('Old car');
      expect(returnedModelsWithCountOutput.count).to.be.eql(2);
    });
  });
});
