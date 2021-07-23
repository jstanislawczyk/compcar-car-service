import {expect} from 'chai';
import {ColorMapper} from './color.mapper';
import {ColorCreateInput} from '../models/inputs/color/color-create.input';
import {Color} from '../models/entities/color';

context('ColorMapper', () => {

  let colorMapper: ColorMapper;

  beforeEach(() => {
    colorMapper = new ColorMapper();
  });

  describe('toEntity', () => {
    it('should map to entity', () => {
      // Arrange
      const colorCreateInput: ColorCreateInput = {
        name: 'red',
        hexCode: '#F00',
      };

      // Act
      const color: Color = colorMapper.toEntity(colorCreateInput);

      // Assert
      expect(color.name).to.be.eql(colorCreateInput.name);
      expect(color.hexCode).to.be.eql(colorCreateInput.hexCode);
      expect(color.id).to.be.undefined;
      expect(color.paintings).to.be.undefined;
    });
  });
});
