import {expect} from 'chai';
import {ColorMapper} from './color.mapper';
import {CreateColorInput} from '../models/inputs/color/create-color.input';
import {Color} from '../models/entities/color';

context('ColorMapper', () => {

  let colorMapper: ColorMapper;

  beforeEach(() => {
    colorMapper = new ColorMapper();
  });

  describe('toEntity', () => {
    it('should map to entity', () => {
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
  });
});
