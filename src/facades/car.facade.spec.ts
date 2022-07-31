import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {CarFacade} from './car.facade';
import {CarService} from '../services/car.service';
import {CarBuilder} from '../../test/utils/builders/car.builder';
import {Car} from '../models/entities/car';
import {GenerationService} from '../services/generation.service';
import {PhotoService} from '../services/photo.service';
import {CarCreate} from '../models/common/create/car.create';
import {BodyStyle} from '../models/enums/body-style';
import {Generation} from '../models/entities/generation';
import {GenerationBuilder} from '../../test/utils/builders/generation.builder';
import {Photo} from '../models/entities/photo';
import {PhotoBuilder} from '../../test/utils/builders/photo.builder';

use(sinonChai);
use(chaiAsPromised);

context('CarFacade', () => {

  let sandbox: SinonSandbox;
  let carServiceStub: SinonStubbedInstance<CarService>;
  let generationServiceStub: SinonStubbedInstance<GenerationService>;
  let photoServiceStub: SinonStubbedInstance<PhotoService>;
  let carFacade: CarFacade;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    carServiceStub = sandbox.createStubInstance(CarService);
    generationServiceStub = sandbox.createStubInstance(GenerationService);
    photoServiceStub = sandbox.createStubInstance(PhotoService);

    carFacade = new CarFacade(carServiceStub, generationServiceStub, photoServiceStub);
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('findAllCars', () => {
    it('should find all cars', async () => {
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

      carServiceStub.findAll.resolves(existingCars);

      // Act
      const returnedCars: Car[] = await carFacade.findAllCars();

      // Assert
      expect(returnedCars).to.be.eql(existingCars);
      expect(carServiceStub.findAll).to.be.calledOnce;
    });

    it('should rethrow error from car service', async () => {
      // Arrange
      carServiceStub.findAll.rejects(new Error('Not Found'));

      // Act
      const returnedCarsResult: Promise<Car[]> = carFacade.findAllCars();

      // Assert
      await expect(returnedCarsResult).to.eventually
        .be.rejectedWith('Not Found')
        .and.to.be.an.instanceOf(Error);
      expect(carServiceStub.findAll).to.be.calledOnce;
    });
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

  describe('createCar', () => {
    it('should create car with mandatory properties only', async () => {
      // Arrange
      const generationId: number = 1;
      const generation: Generation = new GenerationBuilder(true)
        .withId(generationId)
        .build();
      const carCreate: CarCreate = {
        name: 'Audi',
        description: 'Test car',
        basePrice: 10000,
        bodyStyle: BodyStyle.KOMBI,
        startYear: 2010,
        weight: 1600,
        generationId,
      };
      const existingCar: Car = new CarBuilder(true).build();

      generationServiceStub.findOne.resolves(generation);
      carServiceStub.saveCar.resolves(existingCar);

      // Act
      const returnedCar: Car = await carFacade.createCar(carCreate);

      // Assert
      expect(returnedCar).to.be.eql(existingCar);
      expect(carServiceStub.saveCar).to.be.calledOnceWith({
        description: carCreate.description,
        name: carCreate.name,
        basePrice: carCreate.basePrice,
        startYear: carCreate.startYear,
        endYear: carCreate.endYear,
        weight: carCreate.weight,
        bodyStyle: carCreate.bodyStyle,
        generation,
        photos: undefined,
      });
      expect(generationServiceStub.findOne).to.be.calledOnceWith(generationId);
      expect(photoServiceStub.findRelatedPhotosByIds).to.be.not.called;
    });

    it('should create car with all properties', async () => {
      // Arrange
      const generationId: number = 1;
      const generation: Generation = new GenerationBuilder(true)
        .withId(generationId)
        .build();
      const firstPhoto: Photo = new PhotoBuilder(true).build();
      const secondPhoto: Photo = new PhotoBuilder(true)
        .withUrl('Second url')
        .build();
      const photos: Photo[] = [firstPhoto, secondPhoto];
      const photosIds: number[] = photos.map((photo: Photo) => photo.id as number);
      const carCreate: CarCreate = {
        name: 'Audi',
        description: 'Test car',
        basePrice: 10000,
        bodyStyle: BodyStyle.KOMBI,
        startYear: 2010,
        weight: 1600,
        generationId,
        photosIds,
      };
      const existingCar: Car = new CarBuilder(true).build();

      generationServiceStub.findOne.resolves(generation);
      photoServiceStub.findRelatedPhotosByIds.resolves(photos);
      carServiceStub.saveCar.resolves(existingCar);

      // Act
      const returnedCar: Car = await carFacade.createCar(carCreate);

      // Assert
      expect(returnedCar).to.be.eql(existingCar);
      expect(carServiceStub.saveCar).to.be.calledOnceWith({
        description: carCreate.description,
        name: carCreate.name,
        basePrice: carCreate.basePrice,
        startYear: carCreate.startYear,
        endYear: carCreate.endYear,
        weight: carCreate.weight,
        bodyStyle: carCreate.bodyStyle,
        generation,
        photos,
      });
      expect(generationServiceStub.findOne).to.be.calledOnceWith(generationId);
      expect(photoServiceStub.findRelatedPhotosByIds).to.be.calledOnceWith(photosIds);
    });

    describe('error handling', () => {
      it('should rethrow error from GenerationService findOne method', async () => {
        // Arrange
        const generationId: number = 1;
        const carCreate: CarCreate = {
          name: 'Audi',
          description: 'Test car',
          basePrice: 10000,
          bodyStyle: BodyStyle.KOMBI,
          startYear: 2010,
          weight: 1600,
          generationId,
        };

        generationServiceStub.findOne.rejects(new Error('Find error'));

        // Act
        const returnedCarResult: Promise<Car> = carFacade.createCar(carCreate);

        // Assert
        await expect(returnedCarResult).to.eventually
          .be.rejectedWith('Find error')
          .and.to.be.an.instanceOf(Error);
        expect(generationServiceStub.findOne).to.be.calledOnce;
        expect(photoServiceStub.findRelatedPhotosByIds).to.be.not.called;
        expect(carServiceStub.saveCar).to.be.not.called;
      });

      it('should rethrow error from PhotoService findRelatedPhotosByIds method', async () => {
        // Arrange
        const generationId: number = 1;
        const generation: Generation = new GenerationBuilder(true)
          .withId(generationId)
          .build();
        const firstPhoto: Photo = new PhotoBuilder(true).build();
        const secondPhoto: Photo = new PhotoBuilder(true)
          .withUrl('Second url')
          .build();
        const photos: Photo[] = [firstPhoto, secondPhoto];
        const photosIds: number[] = photos.map((photo: Photo) => photo.id as number);
        const carCreate: CarCreate = {
          name: 'Audi',
          description: 'Test car',
          basePrice: 10000,
          bodyStyle: BodyStyle.KOMBI,
          startYear: 2010,
          weight: 1600,
          generationId,
          photosIds,
        };

        generationServiceStub.findOne.resolves(generation);
        photoServiceStub.findRelatedPhotosByIds.rejects(new Error('Find error'));

        // Act
        const returnedCarResult: Promise<Car> = carFacade.createCar(carCreate);

        // Assert
        await expect(returnedCarResult).to.eventually
          .be.rejectedWith('Find error')
          .and.to.be.an.instanceOf(Error);
        expect(carServiceStub.saveCar).to.be.not.called;
        expect(generationServiceStub.findOne).to.be.calledOnce;
        expect(photoServiceStub.findRelatedPhotosByIds).to.be.calledOnce;
      });

      it('should rethrow error from CarService saveCar method', async () => {
        // Arrange
        const generationId: number = 1;
        const generation: Generation = new GenerationBuilder(true)
          .withId(generationId)
          .build();
        const carCreate: CarCreate = {
          name: 'Audi',
          description: 'Test car',
          basePrice: 10000,
          bodyStyle: BodyStyle.KOMBI,
          startYear: 2010,
          weight: 1600,
          generationId,
        };

        generationServiceStub.findOne.resolves(generation);
        carServiceStub.saveCar.rejects(new Error('SaveCar error'));

        // Act
        const returnedCarResult: Promise<Car> = carFacade.createCar(carCreate);

        // Assert
        await expect(returnedCarResult).to.eventually
          .be.rejectedWith('SaveCar error')
          .and.to.be.an.instanceOf(Error);
        expect(carServiceStub.saveCar).to.be.calledOnce;
        expect(generationServiceStub.findOne).to.be.calledOnce;
        expect(photoServiceStub.findRelatedPhotosByIds).to.be.not.called;
      });
    });
  });
});
