import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {Car} from '../models/entities/car';
import {CarResolver} from './car.resolver';
import {CarFacade} from '../facades/car.facade';
import {CarBuilder} from '../../test/utils/builders/car.builder';
import {CarMapper} from '../mapper/car.mapper';
import {CreateCarInput} from '../models/inputs/car/create-car.input';
import {CarCreate} from '../models/common/create/car.create';
import {BodyStyle} from '../models/enums/body-style';

use(sinonChai);
use(chaiAsPromised);

context('CarResolver', () => {

  let sandbox: SinonSandbox;
  let carFacadeStub: SinonStubbedInstance<CarFacade>;
  let carMapperStub: SinonStubbedInstance<CarMapper>;
  let carResolver: CarResolver;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    carFacadeStub = sandbox.createStubInstance(CarFacade);
    carMapperStub = sandbox.createStubInstance(CarMapper);

    carResolver = new CarResolver(carFacadeStub, carMapperStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getCars', () => {
    it('should find car by id', async () => {
      // Arrange
      const firstCar: Car = new CarBuilder()
        .withId(1)
        .withName('First car')
        .build();
      const secondCar: Car = new CarBuilder()
        .withId(2)
        .withName('Second car')
        .build();
      const existingCars: Car[] = [firstCar, secondCar];

      carFacadeStub.findAllCars.resolves(existingCars);

      // Act
      const returnedCars: Car[] = await carResolver.getCars();

      // Assert
      expect(returnedCars).to.be.eql(existingCars);
      expect(carFacadeStub.findAllCars).to.be.calledOnce;
    });

    it('should rethrow error from facade', async () => {
      // Arrange
      carFacadeStub.findAllCars.rejects(new Error('Not Found'));

      // Act
      const returnedCarsResult: Promise<Car[]> = carResolver.getCars();

      // Assert
      await expect(returnedCarsResult).to.eventually
        .be.rejectedWith('Not Found')
        .and.to.be.an.instanceOf(Error);
      expect(carFacadeStub.findAllCars).to.be.calledOnce;
    });
  });

  describe('getCarById', () => {
    it('should find car by id', async () => {
      // Arrange
      const carId: number = 1;
      const existingCar: Car = new CarBuilder()
          .withId(carId)
          .build();

      carFacadeStub.findCarById.resolves(existingCar);

      // Act
      const returnedCar: Car = await carResolver.getCarById(carId);

      // Assert
      expect(returnedCar).to.be.eql(existingCar);
      expect(carFacadeStub.findCarById).to.be.calledOnceWith(carId);
    });

    it('should rethrow error from facade', async () => {
      // Arrange
      const carId: number = 1;

      carFacadeStub.findCarById.rejects(new Error('Not Found'));

      // Act
      const returnedCarResult: Promise<Car> = carResolver.getCarById(carId);

      // Assert
      await expect(returnedCarResult).to.eventually
          .be.rejectedWith('Not Found')
          .and.to.be.an.instanceOf(Error);
      expect(carFacadeStub.findCarById).to.be.calledOnceWith(carId);
    });
  });

  describe('createCar', () => {
    it('should create car', async () => {
      // Arrange
      const carCreate: CarCreate = {
        name: 'New Car',
        description: 'Test description',
        basePrice: 10000,
        bodyStyle: BodyStyle.KOMBI,
        startYear: 2020,
        endYear: 2021,
        weight: 1000,
        generationId: 1,
        carEnginesIds: [1, 2],
        carAddonsIds: [3, 4],
        paintingIds: [5, 6],
        photosIds: [7, 8],
      };
      const createCarInput: CreateCarInput = {
        name: 'New Car',
        description: 'Test description',
        basePrice: 10000,
        bodyStyle: BodyStyle.KOMBI,
        startYear: 2020,
        endYear: 2021,
        weight: 1000,
        generationId: 1,
        carEnginesIds: [1, 2],
        carAddonsIds: [3, 4],
        paintingIds: [5, 6],
        photosIds: [7, 8],
      };
      const savedCar: Car = new CarBuilder(true).build();

      carMapperStub.toCreateModel.returns(carCreate);
      carFacadeStub.createCar.resolves(savedCar);

      // Act
      const returnedCar: Car = await carResolver.createCar(createCarInput);

      // Assert
      expect(returnedCar).to.be.eql(savedCar);
      expect(carMapperStub.toCreateModel).to.be.calledOnceWith(createCarInput);
      expect(carFacadeStub.createCar).to.be.calledOnceWith(carCreate);
    });

    it('should throw error if car saving fails', async () => {
      // Arrange
      const carCreate: CarCreate = {
        name: 'New Car',
        description: 'Test description',
        basePrice: 10000,
        bodyStyle: BodyStyle.KOMBI,
        startYear: 2020,
        endYear: 2021,
        weight: 1000,
        generationId: 1,
        carEnginesIds: [1, 2],
        carAddonsIds: [3, 4],
        paintingIds: [5, 6],
        photosIds: [7, 8],
      };
      const createCarInput: CreateCarInput = {
        name: 'New Car',
        description: 'Test description',
        basePrice: 10000,
        bodyStyle: BodyStyle.KOMBI,
        startYear: 2020,
        endYear: 2021,
        weight: 1000,
        generationId: 1,
        carEnginesIds: [1, 2],
        carAddonsIds: [3, 4],
        paintingIds: [5, 6],
        photosIds: [7, 8],
      };

      carMapperStub.toCreateModel.returns(carCreate);
      carFacadeStub.createCar.rejects(new Error('CreateCar error'));

      // Act
      const returnedCarResult: Promise<Car> = carResolver.createCar(createCarInput);

      // Assert
      await expect(returnedCarResult).to.eventually.be.rejectedWith('CreateCar error');
    });
  });
});
