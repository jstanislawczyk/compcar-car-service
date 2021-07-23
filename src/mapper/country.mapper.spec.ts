import {expect} from 'chai';
import {CountryMapper} from './country.mapper';
import {CountryCreateInput} from '../models/inputs/country/country-create.input';
import {v4} from 'uuid';
import {Country} from '../models/entities/country';

context('CountryMapper', () => {

  let countryMapper: CountryMapper;

  beforeEach(() => {
    countryMapper = new CountryMapper();
  });

  describe('toEntity', () => {
    it('should map to entity', () => {
      // Arrange
      const countryCreateInput: CountryCreateInput = {
        name: 'red',
        flagPhotoUrl: `https://test.url.${v4()}.com/`,
      };

      // Act
      const country: Country = countryMapper.toEntity(countryCreateInput);

      // Assert
      expect(country.name).to.be.eql(countryCreateInput.name);
      expect(country.flagPhotoUrl).to.be.eql(countryCreateInput.flagPhotoUrl);
      expect(country.id).to.be.undefined;
      expect(country.brands).to.be.undefined;
    });
  });
});
