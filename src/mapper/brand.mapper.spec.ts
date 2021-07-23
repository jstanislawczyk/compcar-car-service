import {expect} from 'chai';
import {BrandMapper} from './brand.mapper';
import {BrandCreateInput} from '../models/inputs/brand/brand-create.input';
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
      const brandCreateInput: BrandCreateInput = {
        name: 'red',
        logoPhotoUrl: `https://test.photo.url.${v4()}.com/`,
      };

      // Act
      const brand: Brand = brandMapper.toEntity(brandCreateInput);

      // Assert
      expect(brand.name).to.be.eql(brandCreateInput.name);
      expect(brand.logoPhotoUrl).to.be.eql(brandCreateInput.logoPhotoUrl);
      expect(brand.id).to.be.undefined;
      expect(brand.country).to.be.undefined;
      expect(brand.models).to.be.undefined;
    });
  });
});
