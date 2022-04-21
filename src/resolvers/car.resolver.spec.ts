import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {Car} from '../models/entities/car';
import {CarResolver} from './car.resolver';
import {CarFacade} from '../facades/car.facade';
import {CarBuilder} from '../../test/utils/builders/car.builder';

use(sinonChai);
use(chaiAsPromised);

context('CarResolver', () => {

  let sandbox: SinonSandbox;
  let carFacadeStub: SinonStubbedInstance<CarFacade>;
  let carResolver: CarResolver;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    carFacadeStub = sandbox.createStubInstance(CarFacade);

    carResolver = new CarResolver(carFacadeStub);
  });

  afterEach(() => {
    sandbox.restore();
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
});
