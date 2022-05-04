import {expect} from 'chai';
import {ColorMapper} from './color.mapper';
import {CreateColorInput} from '../models/inputs/color/create-color.input';
import {Color} from '../models/entities/color';
import {UpdateColorInput} from '../models/inputs/color/update-color.input';
import {ColorUpdate} from '../models/common/update/color-update';

context('ColorMapper', () => {

  let colorMapper: ColorMapper;

  beforeEach(() => {
    colorMapper = new ColorMapper();
  });

  describe('toEntity', () => {
    it('should map to entity with 3 digit hexCode', () => {
      // Arrange
      const createColorInput: CreateColorInput = {
        name: 'red',
        hexCode: '#F00',
      };

      // Act
      const color: Color = colorMapper.toEntity(createColorInput);

      // Assert
      expect(color.name).to.be.eql(createColorInput.name);
      expect(color.hexCode).to.be.eql(createColorInput.hexCode);
      expect(color.id).to.be.undefined;
      expect(color.paintings).to.be.undefined;
    });

    it('should map to entity with 6 digit hexCode that can be shorter', () => {
      // Arrange
      const createColorInput: CreateColorInput = {
        name: 'red',
        hexCode: '#FF0000',
      };

      // Act
      const color: Color = colorMapper.toEntity(createColorInput);

      // Assert
      expect(color.name).to.be.eql(createColorInput.name);
      expect(color.hexCode).to.be.eql('#F00');
      expect(color.id).to.be.undefined;
      expect(color.paintings).to.be.undefined;
    });

    it("should map to entity with 6 digit hexCode that can't be shorter", () => {
      // Arrange
      const createColorInput: CreateColorInput = {
        name: 'red',
        hexCode: '#FF12CD',
      };

      // Act
      const color: Color = colorMapper.toEntity(createColorInput);

      // Assert
      expect(color.name).to.be.eql(createColorInput.name);
      expect(color.hexCode).to.be.eql(createColorInput.hexCode);
      expect(color.id).to.be.undefined;
      expect(color.paintings).to.be.undefined;
    });

    it('should map to entity with uppercase hexCode', () => {
      // Arrange
      const createColorInput: CreateColorInput = {
        name: 'red',
        hexCode: '#fF12cd',
      };

      // Act
      const color: Color = colorMapper.toEntity(createColorInput);

      // Assert
      expect(color.name).to.be.eql(createColorInput.name);
      expect(color.hexCode).to.be.eql('#FF12CD');
      expect(color.id).to.be.undefined;
      expect(color.paintings).to.be.undefined;
    });
  });

  describe('toUpdateEntity', () => {
    it('should map to model with required properties only', () => {
      // Arrange
      const updateColorInput: UpdateColorInput = {
        id: 1,
      };

      // Act
      const colorUpdate: ColorUpdate = colorMapper.toUpdateModel(updateColorInput);

      // Assert
      expect(colorUpdate.id).to.be.eql(updateColorInput.id);
      expect(colorUpdate.name).to.be.undefined;
      expect(colorUpdate.hexCode).to.be.undefined;
    });

    it('should map to model with all properties', () => {
      // Arrange
      const updateColorInput: UpdateColorInput = {
        id: 1,
        name: 'red',
        hexCode: '#F00',
      };

      // Act
      const colorUpdate: ColorUpdate = colorMapper.toUpdateModel(updateColorInput);

      // Assert
      expect(colorUpdate.id).to.be.eql(updateColorInput.id);
      expect(colorUpdate.name).to.be.eql(updateColorInput.name);
      expect(colorUpdate.hexCode).to.be.eql(updateColorInput.hexCode);
    });

    it('should map to model with 6 digit hexCode that can be shorter', () => {
      // Arrange
      const updateColorInput: UpdateColorInput = {
        id: 1,
        name: 'red',
        hexCode: '#FF00AA',
      };

      // Act
      const colorUpdate: ColorUpdate = colorMapper.toUpdateModel(updateColorInput);

      // Assert
      expect(colorUpdate.id).to.be.eql(updateColorInput.id);
      expect(colorUpdate.name).to.be.eql(updateColorInput.name);
      expect(colorUpdate.hexCode).to.be.eql('#F0A');
    });

    it("should map to model with 6 digit hexCode that can't be shorter", () => {
      // Arrange
      const updateColorInput: UpdateColorInput = {
        id: 1,
        name: 'red',
        hexCode: '#FA12CD',
      };

      // Act
      const colorUpdate: ColorUpdate = colorMapper.toUpdateModel(updateColorInput);

      // Assert
      expect(colorUpdate.id).to.be.eql(updateColorInput.id);
      expect(colorUpdate.name).to.be.eql(updateColorInput.name);
      expect(colorUpdate.hexCode).to.be.eql(updateColorInput.hexCode);
    });

    it('should map to model with uppercase hexCode', () => {
      // Arrange
      const updateColorInput: UpdateColorInput = {
        id: 1,
        name: 'red',
        hexCode: '#Fa12cd',
      };

      // Act
      const colorUpdate: ColorUpdate = colorMapper.toUpdateModel(updateColorInput);

      // Assert
      expect(colorUpdate.id).to.be.eql(updateColorInput.id);
      expect(colorUpdate.name).to.be.eql(updateColorInput.name);
      expect(colorUpdate.hexCode).to.be.eql('#FA12CD');
    });
  });
});
