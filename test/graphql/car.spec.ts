import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {expect} from 'chai';
import {CommonDatabaseUtils} from '../utils/database-utils/common.database-utils';
import {ResponseError} from '../utils/interfaces/response-error';
import {CarDatabaseUtils} from '../utils/database-utils/car.database-utils';
import {Car} from '../../src/models/entities/car';
import {CarBuilder} from '../utils/builders/car.builder';
import {BodyStyle} from '../../src/models/enums/body-style';

describe('Car', () => {

  before(async () => {
    await CommonDatabaseUtils.deleteAllEntities();
  });

  beforeEach(async () => {
    await CarDatabaseUtils.deleteAllCars();
  });

  describe('getCars', () => {
    it('should get cars list', async () => {
      // Arrange
      const firstCar: Car = new CarBuilder()
        .withName('B7')
        .withDescription('First description')
        .withBasePrice(40000)
        .withStartYear(2012)
        .withEndYear(2019)
        .withWeight(1300)
        .withBodyStyle(BodyStyle.SEDAN)
        .build();
      const secondCar: Car = new CarBuilder()
        .withName('B6')
        .withDescription('Second description')
        .withBasePrice(20000)
        .withStartYear(2002)
        .withEndYear(2006)
        .withWeight(1200)
        .withBodyStyle(BodyStyle.KOMBI)
        .build();
      const savedCars: Car[] = await CarDatabaseUtils.saveCarsList([firstCar, secondCar]);
      const query: string = `
        {
          getCars {
            id,
            name,
            description,
            basePrice,
            startYear,
            endYear,
            weight,
            bodyStyle,
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const returnedCarResponse: Car[] = response.body.data.getCars as Car[];
      expect(Number(returnedCarResponse[0].id)).to.eql(savedCars[0].id);
      expect(returnedCarResponse[0].name).to.be.eql('B7');
      expect(returnedCarResponse[0].description).to.be.eql('First description');
      expect(returnedCarResponse[0].basePrice).to.be.eql(40000);
      expect(returnedCarResponse[0].weight).to.be.eql(1300);
      expect(returnedCarResponse[0].bodyStyle).to.be.eql(BodyStyle.SEDAN);
      expect(returnedCarResponse[0].startYear).to.be.eql(2012);
      expect(returnedCarResponse[0].endYear).to.be.eql(2019);
      expect(returnedCarResponse[0].paintings).to.be.undefined;
      expect(returnedCarResponse[0].generation).to.be.undefined;
      expect(returnedCarResponse[0].carAddons).to.be.undefined;
      expect(returnedCarResponse[0].carEngines).to.be.undefined;
      expect(returnedCarResponse[0].photos).to.be.undefined;
      expect(Number(returnedCarResponse[1].id)).to.eql(savedCars[1].id);
      expect(returnedCarResponse[1].name).to.be.eql('B6');
      expect(returnedCarResponse[1].description).to.be.eql('Second description');
      expect(returnedCarResponse[1].basePrice).to.be.eql(20000);
      expect(returnedCarResponse[1].weight).to.be.eql(1200);
      expect(returnedCarResponse[1].bodyStyle).to.be.eql(BodyStyle.KOMBI);
      expect(returnedCarResponse[1].startYear).to.be.eql(2002);
      expect(returnedCarResponse[1].endYear).to.be.eql(2006);
      expect(returnedCarResponse[1].paintings).to.be.undefined;
      expect(returnedCarResponse[1].generation).to.be.undefined;
      expect(returnedCarResponse[1].carAddons).to.be.undefined;
      expect(returnedCarResponse[1].carEngines).to.be.undefined;
      expect(returnedCarResponse[1].photos).to.be.undefined;

      const existingCars: Car[] = await CarDatabaseUtils.getAllCars();
      expect(returnedCarResponse[0].id).to.be.be.eql(existingCars[0].id?.toString());
      expect(returnedCarResponse[0].name).to.be.be.eql(existingCars[0].name);
      expect(returnedCarResponse[0].description).to.be.be.eql(existingCars[0].description);
      expect(returnedCarResponse[0].basePrice).to.be.eql(existingCars[0].basePrice);
      expect(returnedCarResponse[0].weight).to.be.eql(existingCars[0].weight);
      expect(returnedCarResponse[0].bodyStyle).to.be.eql(existingCars[0].bodyStyle);
      expect(returnedCarResponse[0].startYear).to.be.eql(existingCars[0].startYear);
      expect(returnedCarResponse[0].endYear).to.be.eql(existingCars[0].endYear);
      expect(returnedCarResponse[1].id).to.be.be.eql(existingCars[1].id?.toString());
      expect(returnedCarResponse[1].name).to.be.be.eql(existingCars[1].name);
      expect(returnedCarResponse[1].description).to.be.be.eql(existingCars[1].description);
      expect(returnedCarResponse[1].basePrice).to.be.eql(existingCars[1].basePrice);
      expect(returnedCarResponse[1].weight).to.be.eql(existingCars[1].weight);
      expect(returnedCarResponse[1].bodyStyle).to.be.eql(existingCars[1].bodyStyle);
      expect(returnedCarResponse[1].startYear).to.be.eql(existingCars[1].startYear);
      expect(returnedCarResponse[1].endYear).to.be.eql(existingCars[1].endYear);
    });
  });

  describe('getCarById', () => {
    it('should get car by id', async () => {
      // Arrange
      const car: Car = new CarBuilder(true)
          .withName('B6')
          .withDescription('Test description')
          .withBasePrice(20000)
          .withStartYear(2012)
          .withEndYear(2019)
          .withWeight(1200)
          .withBodyStyle(BodyStyle.KOMBI)
          .build();
      const savedCar: Car = await CarDatabaseUtils.saveCar(car);
      const query: string = `
        {
          getCarById(id: ${savedCar.id}) {
            id,
            name,
            description,
            basePrice,
            startYear,
            endYear,
            weight,
            bodyStyle,
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({ query })
          .expect(200);

      const returnedCarResponse: Car = response.body.data.getCarById as Car;
      expect(Number(returnedCarResponse.id)).to.be.above(0);
      expect(returnedCarResponse.name).to.be.eql('B6');
      expect(returnedCarResponse.description).to.be.eql('Test description');
      expect(returnedCarResponse.basePrice).to.be.eql(20000);
      expect(returnedCarResponse.weight).to.be.eql(1200);
      expect(returnedCarResponse.bodyStyle).to.be.eql(BodyStyle.KOMBI);
      expect(returnedCarResponse.startYear).to.be.eql(2012);
      expect(returnedCarResponse.endYear).to.be.eql(2019);
      expect(returnedCarResponse.paintings).to.be.undefined;
      expect(returnedCarResponse.generation).to.be.undefined;
      expect(returnedCarResponse.carAddons).to.be.undefined;
      expect(returnedCarResponse.carEngines).to.be.undefined;
      expect(returnedCarResponse.photos).to.be.undefined;

      const existingCar: Car = await CarDatabaseUtils.getCarByIdOrFail(
        Number(returnedCarResponse.id)
      );
      expect(returnedCarResponse.id).to.be.be.eql(existingCar.id?.toString());
      expect(returnedCarResponse.name).to.be.be.eql(existingCar.name);
      expect(returnedCarResponse.description).to.be.be.eql(existingCar.description);
      expect(returnedCarResponse.basePrice).to.be.eql(existingCar.basePrice);
      expect(returnedCarResponse.weight).to.be.eql(existingCar.weight);
      expect(returnedCarResponse.bodyStyle).to.be.eql(existingCar.bodyStyle);
      expect(returnedCarResponse.startYear).to.be.eql(existingCar.startYear);
      expect(returnedCarResponse.endYear).to.be.eql(existingCar.endYear);
    });

    it("should throw error if car doesn't exist", async () => {
      // Arrange
      const notExistingCarId: number = 0;
      const query: string = `
        {
          getCarById(id: ${notExistingCarId}) {
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
      expect(error.message).to.be.eql(`Car with id=${notExistingCarId} not found`);
      expect(error.extensions.code).to.be.eql('NOT_FOUND');
    });
  });
});
