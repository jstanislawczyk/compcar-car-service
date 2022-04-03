import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {expect} from 'chai';
import {CommonDatabaseUtils} from '../utils/database-utils/common.database-utils';
import {ResponseError} from '../utils/interfaces/response-error';
import {GenerationDatabaseUtils} from '../utils/database-utils/generation.database-utils';
import {Generation} from '../../src/models/entities/generation';
import {GenerationBuilder} from '../utils/builders/generation.builder';

describe('Generation', () => {

  before(async () => {
    await CommonDatabaseUtils.deleteAllEntities();
  });

  beforeEach(async () => {
    await GenerationDatabaseUtils.deleteAllGenerations();
  });

  describe('getGenerationById', () => {
    it('should get generation by id', async () => {
      // Arrange
      const generation: Generation = new GenerationBuilder(true)
          .withName('B6')
          .withDescription('Test description')
          .build();
      const savedGeneration: Generation = await GenerationDatabaseUtils.saveGeneration(generation);
      const query: string = `
        {
          getGenerationById(id: ${savedGeneration.id}) {
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

      const returnedGenerationResponse: Generation = response.body.data.getGenerationById as Generation;
      expect(Number(returnedGenerationResponse.id)).to.be.above(0);
      expect(returnedGenerationResponse.name).to.be.eql('B6');
      expect(returnedGenerationResponse.description).to.be.eql('Test description');
      expect(returnedGenerationResponse.model).to.be.undefined;
      expect(returnedGenerationResponse.cars).to.be.undefined;
      expect(returnedGenerationResponse.comments).to.be.undefined;

      const existingGeneration: Generation = await GenerationDatabaseUtils.getGenerationByIdOrFail(
        Number(returnedGenerationResponse.id)
      );
      expect(returnedGenerationResponse.id).to.be.be.eql(existingGeneration.id?.toString());
      expect(returnedGenerationResponse.name).to.be.be.eql(existingGeneration.name);
      expect(returnedGenerationResponse.description).to.be.be.eql(existingGeneration.description);
    });

    it("should throw error if generation doesn't exist", async () => {
      // Arrange
      const notExistingGenerationId: number = 0;
      const query: string = `
        {
          getGenerationById(id: ${notExistingGenerationId}) {
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
      expect(error.message).to.be.eql(`Generation with id=${notExistingGenerationId} not found`);
      expect(error.extensions.code).to.be.eql('NOT_FOUND');
    });
  });
});
