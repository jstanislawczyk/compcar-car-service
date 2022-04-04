import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {CarFacade} from './car.facade';
import {CarService} from '../services/car.service';
import {CarBuilder} from '../../test/utils/builders/car.builder';
import {Car} from '../models/entities/car';

use(sinonChai);
use(chaiAsPromised);

context('CarFacade', () => {

  let sandbox: SinonSandbox;
  let carServiceStub: SinonStubbedInstance<CarService>;
  let carFacade: CarFacade;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    carServiceStub = sandbox.createStubInstance(CarService);

    carFacade = new CarFacade(carServiceStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findCarById', () => {
    it('should find car by id', async () => {
      // Arrange
      const carId: number = 1;
      const existingCar: Car = new CarBuilder()
          .withId(carId)
          .build();

      carServiceStub.findOne.resolves(existingCar);

      // Act
      const returnedCar: Car = await carFacade.findCarById(carId);

      // Assert
      expect(returnedCar).to.be.eql(existingCar);
      expect(carServiceStub.findOne).to.be.calledOnceWith(carId);
    });

    it('should rethrow error from car service', async () => {
      // Arrange
      const carId: number = 1;

      carServiceStub.findOne.rejects(new Error('Not Found'));

      // Act
      const returnedCarResult: Promise<Car> = carFacade.findCarById(carId);

      // Assert
      await expect(returnedCarResult).to.eventually
          .be.rejectedWith('Not Found')
          .and.to.be.an.instanceOf(Error);
      expect(carServiceStub.findOne).to.be.calledOnceWith(carId);
    });
  });
});
