import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {NotFoundError} from '../models/errors/not-found.error';
import {CarRepository} from '../repositories/car.repository';
import {CarService} from './car.service';
import {CarBuilder} from '../../test/utils/builders/car.builder';
import {Car} from '../models/entities/car';

use(sinonChai);
use(chaiAsPromised);

context('CarService', () => {

  let sandbox: SinonSandbox;
  let carRepositoryStub: SinonStubbedInstance<CarRepository>;
  let carService: CarService;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    carRepositoryStub = sandbox.createStubInstance(CarRepository);
    carService = new CarService(carRepositoryStub);

    carRepositoryStub.findOne.resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });


  describe('findAll', () => {
    it('should find cars', async () => {
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

      carRepositoryStub.find.resolves(existingCars);

      // Act
      const returnedCars: Car[] = await carService.findAll();

      // Assert
      expect(returnedCars).to.be.eql(existingCars);
      expect(carRepositoryStub.find).to.be.calledOnce;
    });

    it('should rethrow error from repository', async () => {
      // Arrange
      carRepositoryStub.find.rejects(new Error('Not Found'));

      // Act
      const returnedCarsResult: Promise<Car[]> = carService.findAll();

      // Assert
      await expect(returnedCarsResult).to.eventually
        .be.rejectedWith('Not Found')
        .and.to.be.an.instanceOf(Error);
      expect(carRepositoryStub.find).to.be.calledOnce;
    });
  });

  describe('findOne', () => {
    it('should find car by id', async () => {
      // Arrange
      const carId: number = 1;
      const existingCar: Car = new CarBuilder()
          .withId(carId)
          .build();

      carRepositoryStub.findOneOrFail.resolves(existingCar);

      // Act
      const returnedCar: Car = await carService.findOne(carId);

      // Assert
      expect(returnedCar).to.be.eql(existingCar);
      expect(carRepositoryStub.findOneOrFail).to.be.calledOnceWith(carId);
    });

    it("should throw error if car doesn't exist", async () => {
      // Arrange
      const carId: number = 1;

      carRepositoryStub.findOneOrFail.rejects(new Error('Not Found'));

      // Act
      const returnedCarResult: Promise<Car> = carService.findOne(carId);

      // Assert
      await expect(returnedCarResult).to.eventually
          .be.rejectedWith(`Car with id=${carId} not found`)
          .and.to.be.an.instanceOf(NotFoundError);
      expect(carRepositoryStub.findOneOrFail).to.be.calledOnceWith(carId);
    });
  });

  describe('saveCar', () => {
    it('should save car', async () => {
      // Arrange
      const newCar: Car = new CarBuilder().build();
      const savedCar: Car = new CarBuilder()
        .withId(1)
        .build();

      carRepositoryStub.save.resolves(savedCar);

      // Act
      const returnedCar: Car = await carService.saveCar(newCar);

      // Assert
      expect(returnedCar).to.be.eql(savedCar);
      expect(carRepositoryStub.save).to.be.calledOnceWith(newCar);
    });

    it('should rethrow error from repository', async () => {
      // Arrange
      const newCar: Car = new CarBuilder().build();

      carRepositoryStub.save.rejects(new Error('Save error'));

      // Act
      const returnedCarResult: Promise<Car> = carService.saveCar(newCar);

      // Assert
      await expect(returnedCarResult).to.eventually
        .be.rejectedWith('Save error')
        .and.to.be.an.instanceOf(Error);
      expect(carRepositoryStub.save).to.be.calledOnceWith(newCar);
    });
  });
});
