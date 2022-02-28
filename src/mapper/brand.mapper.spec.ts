import {expect} from 'chai';
import {BrandMapper} from './brand.mapper';
import {CreateBrandInput} from '../models/inputs/brand/create-brand.input';
import {v4} from 'uuid';
import {Brand} from '../models/entities/brand';

context('BrandMapper', () => {

  let brandMapper: BrandMapper;

  beforeEach(() => {
    brandMapper = new BrandMapper();
  });

  describe('toEntity', () => {
    it('should map to entity', () => {
      // Arrange
      const createBrandInput: CreateBrandInput = {
        name: 'Audi',
        logoPhotoUrl: `http://compcar-${v4()}.ly`,
      };

      // Act
      const brand: Brand = brandMapper.toEntity(createBrandInput);

      // Assert
      expect(brand.name).to.be.eql(createBrandInput.name);
      expect(brand.logoPhotoUrl).to.be.eql(createBrandInput.logoPhotoUrl);
      expect(brand.id).to.be.undefined;
      expect(brand.models).to.be.undefined;
      expect(brand.country).to.be.undefined;
    });
  });
});
