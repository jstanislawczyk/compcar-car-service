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
});
