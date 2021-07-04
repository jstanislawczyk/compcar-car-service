import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {expect} from 'chai';
import {TestValidationError} from '../utils/interfaces/validation-error';
import {CommonDatabaseUtils} from '../utils/database-utils/common.database-utils';
import {ResponseError} from '../utils/interfaces/response-error';
import {CountryDatabaseUtils} from '../utils/database-utils/country.database-utils';
import {CreateCountryInput} from '../../src/models/inputs/country/create-country.input';
import {Country} from '../../src/models/entities/country';
import {CountryBuilder} from '../utils/builders/country.builder';

describe('Country', () => {

  before(async () => {
    await CommonDatabaseUtils.deleteAllEntities();
  });

  beforeEach(async () => {
    await CountryDatabaseUtils.deleteAllCountries();
  });

  describe('createCountry', () => {
    it('should save country', async () => {
      // Arrange
      const createCountryInput: CreateCountryInput = {
        name: 'Poland',
        flagPhotoUrl: 'https://test.url.foo.bar/',
      };

      const query: string = `
        mutation {
          createCountry (
            createCountryInput: {
              name: "${createCountryInput.name}",
              flagPhotoUrl: "${createCountryInput.flagPhotoUrl}",
            }
          ) {
            id,
            name,
            flagPhotoUrl,
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const savedCountryResponse: Country = response.body.data.createCountry as Country;
      expect(Number(savedCountryResponse.id)).to.be.above(0);
      expect(savedCountryResponse.name).to.be.eql('Poland');
      expect(savedCountryResponse.flagPhotoUrl).to.be.eql('https://test.url.foo.bar/');
      expect(savedCountryResponse.brands).to.be.undefined;

      const existingCountry: Country = await CountryDatabaseUtils.getCountryByIdOrFail(Number(savedCountryResponse.id));
      expect(savedCountryResponse.id).to.be.be.eql(existingCountry.id?.toString());
      expect(savedCountryResponse.name).to.be.be.eql(existingCountry.name);
      expect(savedCountryResponse.flagPhotoUrl).to.be.be.eql(existingCountry.flagPhotoUrl);
    });

    describe('should throw error', () => {
      it('if validation fails', async () => {
        // Arrange
        const createCountryInput: CreateCountryInput = {
          name: 'g',
          flagPhotoUrl: 'Wrong url',
        };

        const query: string = `
          mutation {
            createCountry (
              createCountryInput: {
                name: "${createCountryInput.name}",
                flagPhotoUrl: "${createCountryInput.flagPhotoUrl}",
              }
            ) {
              id,
              name,
              flagPhotoUrl,
            }
          }
        `;

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({ query })
          .expect(200);

        const errorsBody: ResponseError = response.body.errors[0];
        expect(errorsBody.message).to.be.eql('Argument Validation Error');

        const errors: TestValidationError[] = errorsBody.extensions.exception.validationErrors;
        expect(errors).to.have.lengthOf(2);

        expect(errors[0].property).to.be.eql('name');
        expect(errors[0].value).to.be.eql('g');
        expect(errors[0].constraints.minLength).to.be.eql('name must be longer than or equal to 2 characters');
        expect(errors[1].property).to.be.eql('flagPhotoUrl');
        expect(errors[1].value).to.be.eql('Wrong url');
        expect(errors[1].constraints.isUrl).to.be.eql('flagPhotoUrl must be an URL address');
      });

      it('if country already exists', async () => {
        // Arrange
        const countryName: string = 'Poland';
        const existingCountry = new CountryBuilder()
          .withName(countryName)
          .build();
        const createCountryInput: CreateCountryInput = {
          name: countryName,
          flagPhotoUrl: 'https://test.url.foo.bar/',
        };

        const query: string = `
          mutation {
            createCountry (
              createCountryInput: {
                name: "${createCountryInput.name}",
                flagPhotoUrl: "${createCountryInput.flagPhotoUrl}",
              }
            ) {
              id,
              name,
              flagPhotoUrl,
            }
          }
        `;

        await CountryDatabaseUtils.saveCountry(existingCountry);

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({ query })
          .expect(200);

        const error: ResponseError = response.body.errors[0];
        expect(error.message).to.be.eql(`Country with name=${createCountryInput.name} already exists`);
        expect(error.extensions.code).to.be.eql('ENTITY_ALREADY_EXISTS');
      });
    });
  });
});
