import {expect} from 'chai';
import {CountryMapper} from './country.mapper';
import {CreateCountryInput} from '../models/inputs/country/create-country.input';
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
      const createCountryInput: CreateCountryInput = {
        name: 'red',
        flagPhotoUrl: `https://test.url.${v4()}.com/`,
      };

      // Act
      const country: Country = countryMapper.toEntity(createCountryInput);

      // Assert
      expect(country.name).to.be.eql(createCountryInput.name);
      expect(country.flagPhotoUrl).to.be.eql(createCountryInput.flagPhotoUrl);
      expect(country.id).to.be.undefined;
      expect(country.brands).to.be.undefined;
    });
  });
});
