import {expect} from 'chai';
import {PaintingMapper} from './painting.mapper';
import {PaintingCreateInput} from '../models/inputs/painting/painting-create.input';
import {Painting} from '../models/entities/painting';

context('PaintingMapper', () => {

  let paintingMapper: PaintingMapper;

  beforeEach(() => {
    paintingMapper = new PaintingMapper();
  });

  describe('toEntity', () => {
    it('should map to entity', () => {
      // Arrange
      const paintingCreateInput: PaintingCreateInput = {
        price: 123,
      };

      // Act
      const painting: Painting = paintingMapper.toEntity(paintingCreateInput);

      // Assert
      expect(painting.price).to.be.eql(paintingCreateInput.price);
      expect(painting.id).to.be.undefined;
      expect(painting.color).to.be.undefined;
      expect(painting.cars).to.be.undefined;
    });
  });
});
