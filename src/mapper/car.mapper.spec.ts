import {expect} from 'chai';
import {CreateCarInput} from '../models/inputs/car/create-car.input';
import {CarCreate} from '../models/common/create/car.create';
import {BodyStyle} from '../models/enums/body-style';
import {CarMapper} from './car.mapper';

context('CarMapper', () => {

  let carMapper: CarMapper;

  beforeEach(() => {
    carMapper = new CarMapper();
  });

  describe('toCreateModel', () => {
    it('should map to entity with mandatory properties only', () => {
      // Arrange
      const createCarInput: CreateCarInput = {
        name: 'New Car',
        description: 'Test description',
        basePrice: 10000,
        bodyStyle: BodyStyle.KOMBI,
        startYear: 2020,
        weight: 1000,
        generationId: 1,
      };

      // Act
      const carCreate: CarCreate = carMapper.toCreateModel(createCarInput);

      // Assert
      expect(carCreate.name).to.be.eql(createCarInput.name);
      expect(carCreate.description).to.be.eql(createCarInput.description);
      expect(carCreate.basePrice).to.be.eql(createCarInput.basePrice);
      expect(carCreate.bodyStyle).to.be.eql(createCarInput.bodyStyle);
      expect(carCreate.startYear).to.be.eql(createCarInput.startYear);
      expect(carCreate.weight).to.be.eql(createCarInput.weight);
      expect(carCreate.endYear).to.be.undefined;
      expect(carCreate.carEnginesIds).to.be.undefined;
      expect(carCreate.carAddonsIds).to.be.undefined;
      expect(carCreate.paintingIds).to.be.undefined;
      expect(carCreate.photosIds).to.be.undefined;
    });

    it('should map to entity with all properties', () => {
      // Arrange
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

      // Act
      const carCreate: CarCreate = carMapper.toCreateModel(createCarInput);

      // Assert
      expect(carCreate.name).to.be.eql(createCarInput.name);
      expect(carCreate.description).to.be.eql(createCarInput.description);
      expect(carCreate.basePrice).to.be.eql(createCarInput.basePrice);
      expect(carCreate.bodyStyle).to.be.eql(createCarInput.bodyStyle);
      expect(carCreate.startYear).to.be.eql(createCarInput.startYear);
      expect(carCreate.endYear).to.be.eql(createCarInput.endYear);
      expect(carCreate.weight).to.be.eql(createCarInput.weight);
      expect(carCreate.carEnginesIds).to.be.eql(createCarInput.carEnginesIds);
      expect(carCreate.carAddonsIds).to.be.eql(createCarInput.carAddonsIds);
      expect(carCreate.paintingIds).to.be.eql(createCarInput.paintingIds);
      expect(carCreate.photosIds).to.be.eql(createCarInput.photosIds);
    });
  });
});
