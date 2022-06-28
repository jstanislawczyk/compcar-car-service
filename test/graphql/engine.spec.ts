import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {expect} from 'chai';
import {CommonDatabaseUtils} from '../utils/database-utils/common.database-utils';
import {ResponseError} from '../utils/interfaces/response-error';
import {EngineDatabaseUtils} from '../utils/database-utils/engine.database-utils';
import {Engine} from '../../src/models/entities/engine';
import {EngineBuilder} from '../utils/builders/engine.builder';
import {FuelType} from '../../src/models/enums/fuel-type';

describe('Engine', () => {

  before(async () =>
    await CommonDatabaseUtils.deleteAllEntities()
  );

  beforeEach(async () =>
    await EngineDatabaseUtils.deleteAllEngines()
  );

  describe('getEngineById', () => {
    it('should get engine by id', async () => {
      // Arrange
      const engine: Engine = new EngineBuilder(true)
          .withName('1.9TDI')
          .withFuelType(FuelType.DIESEL)
          .withHorsePower(120)
          .withAcceleration(10.1)
          .withAverageFuelConsumption(9.8)
          .withFuelCapacity(1900)
          .withInventedYear('1990')
          .build();
      const savedEngine: Engine = await EngineDatabaseUtils.saveEngine(engine);
      const query: string = `
        {
          getEngineById(id: ${savedEngine.id}) {
            id,
            name,
            fuelType,
            horsePower,
            acceleration,
            averageFuelConsumption,
            fuelCapacity,
            inventedYear,
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({ query })
          .expect(200);

      const returnedEngineResponse: Engine = response.body.data.getEngineById as Engine;
      expect(Number(returnedEngineResponse.id)).to.be.above(0);
      expect(returnedEngineResponse.name).to.be.eql('1.9TDI');
      expect(returnedEngineResponse.fuelType).to.be.eql(FuelType.DIESEL);
      expect(returnedEngineResponse.horsePower).to.be.eql(120);
      expect(returnedEngineResponse.acceleration).to.be.eql(10.1);
      expect(returnedEngineResponse.averageFuelConsumption).to.be.eql(9.8);
      expect(returnedEngineResponse.fuelCapacity).to.be.eql(1900);
      expect(returnedEngineResponse.inventedYear).to.be.eql('1990');
      expect(returnedEngineResponse.carEngines).to.be.undefined;
      expect(returnedEngineResponse.comments).to.be.undefined;

      const existingEngine: Engine = await EngineDatabaseUtils.getEngineByIdOrFail(
        Number(returnedEngineResponse.id)
      );
      expect(returnedEngineResponse.id).to.be.be.eql(existingEngine.id?.toString());
      expect(returnedEngineResponse.name).to.be.be.eql(existingEngine.name);
      expect(returnedEngineResponse.fuelType).to.be.be.eql(existingEngine.fuelType);
      expect(returnedEngineResponse.horsePower).to.be.eql(existingEngine.horsePower);
      expect(returnedEngineResponse.acceleration).to.be.eql(existingEngine.acceleration);
      expect(returnedEngineResponse.averageFuelConsumption).to.be.eql(existingEngine.averageFuelConsumption);
      expect(returnedEngineResponse.fuelCapacity).to.be.eql(existingEngine.fuelCapacity);
      expect(returnedEngineResponse.inventedYear).to.be.eql(existingEngine.inventedYear);
    });

    it("should throw error if engine doesn't exist", async () => {
      // Arrange
      const notExistingEngineId: number = 0;
      const query: string = `
        {
          getEngineById(id: ${notExistingEngineId}) {
            id,
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({ query })
          .expect(200);

      const error: ResponseError = response.body.errors[0];
      expect(error.message).to.be.eql(`Engine with id=${notExistingEngineId} not found`);
      expect(error.extensions.code).to.be.eql('NOT_FOUND');
    });
  });
});
