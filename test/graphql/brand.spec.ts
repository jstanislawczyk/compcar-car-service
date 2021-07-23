import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {expect} from 'chai';
import {TestValidationError} from '../utils/interfaces/validation-error';
import {CommonDatabaseUtils} from '../utils/database-utils/common.database-utils';
import {ResponseError} from '../utils/interfaces/response-error';
import {BrandDatabaseUtils} from '../utils/database-utils/brand.database-utils';
import {CreateBrandInput} from '../../src/models/inputs/brand/create-brand.input';
import {Country} from '../../src/models/entities/country';
import {CountryBuilder} from '../utils/builders/country.builder';
import {CountryDatabaseUtils} from '../utils/database-utils/country.database-utils';
import {Brand} from '../../src/models/entities/brand';
import {BrandBuilder} from '../utils/builders/brand.builder';

describe('Brand', () => {

  before(async () => {
    await CommonDatabaseUtils.deleteAllEntities();
  });

  beforeEach(async () => {
    await BrandDatabaseUtils.deleteAllBrands();
    await CountryDatabaseUtils.deleteAllCountries();
  });

  describe('getBrandById', () => {
    it('should get brand by id', async () => {
      // Arrange
      const brand: Brand = new BrandBuilder()
          .withName('Audi')
          .withLogoPhotoUrl('https://test.logo.url.foo.bar/')
          .build();
      const savedBrand: Brand = await BrandDatabaseUtils.saveBrand(brand);

      const query: string = `
        {
          getBrandById(id: ${savedBrand.id}) {
            id,
            name,
            logoPhotoUrl,
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({ query })
          .expect(200);

      const returnedBrandResponse: Brand = response.body.data.getBrandById as Brand;
      expect(Number(returnedBrandResponse.id)).to.be.above(0);
      expect(returnedBrandResponse.name).to.be.eql('Audi');
      expect(returnedBrandResponse.logoPhotoUrl).to.be.eql('https://test.logo.url.foo.bar/');
      expect(returnedBrandResponse.country).to.be.undefined;
      expect(returnedBrandResponse.models).to.be.undefined;

      const existingBrand: Brand = await BrandDatabaseUtils.getBrandByIdOrFail(Number(returnedBrandResponse.id));
      expect(returnedBrandResponse.id).to.be.be.eql(existingBrand.id?.toString());
      expect(returnedBrandResponse.name).to.be.be.eql(existingBrand.name);
      expect(returnedBrandResponse.logoPhotoUrl).to.be.be.eql(existingBrand.logoPhotoUrl);
    });

    it("should throw error if error doesn't exist", async () => {
      // Arrange
      const notExistingBrandId: number = 0;
      const query: string = `
        {
          getBrandById(id: ${notExistingBrandId}) {
            id,
            name,
            logoPhotoUrl,
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
          .post('/graphql')
          .send({ query })
          .expect(200);

      const error: ResponseError = response.body.errors[0];
      expect(error.message).to.be.eql(`Brand with id=${notExistingBrandId} not found`);
      expect(error.extensions.code).to.be.eql('NOT_FOUND');
    });
  });

  describe('createBrand', () => {
    it('should save brand', async () => {
      // Arrange
      const createBrandInput: CreateBrandInput = {
        name: 'Audi',
        logoPhotoUrl: 'https://test.logo.url.foo.bar/',
      };
      const country: Country = new CountryBuilder().build();
      const savedCountry: Country = await CountryDatabaseUtils.saveCountry(country);

      const query: string = `
        mutation {
          createBrand (
            countryId: ${savedCountry.id},
            createBrandInput: {
              name: "${createBrandInput.name}",
              logoPhotoUrl: "${createBrandInput.logoPhotoUrl}",
            }
          ) {
            id,
            name,
            logoPhotoUrl,
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const savedBrandResponse: Brand = response.body.data.createBrand as Brand;
      expect(Number(savedBrandResponse.id)).to.be.above(0);
      expect(savedBrandResponse.name).to.be.eql('Audi');
      expect(savedBrandResponse.logoPhotoUrl).to.be.eql('https://test.logo.url.foo.bar/');
      expect(savedBrandResponse.country).to.be.undefined;
      expect(savedBrandResponse.models).to.be.undefined;

      const existingBrand: Brand = await BrandDatabaseUtils.getBrandByIdOrFail(Number(savedBrandResponse.id));
      expect(savedBrandResponse.id).to.be.be.eql(existingBrand.id?.toString());
      expect(savedBrandResponse.name).to.be.be.eql(existingBrand.name);
      expect(savedBrandResponse.logoPhotoUrl).to.be.be.eql(existingBrand.logoPhotoUrl);
    });

    describe('should throw error', () => {
      it('if validation fails', async () => {
        // Arrange
        const createBrandInput: CreateBrandInput = {
          name: 'A',
          logoPhotoUrl: 'Wrong url',
        };
        const country: Country = new CountryBuilder().build();
        const savedCountry: Country = await CountryDatabaseUtils.saveCountry(country);

        const query: string = `
          mutation {
            createBrand (
              countryId: ${savedCountry.id},
              createBrandInput: {
                name: "${createBrandInput.name}",
                logoPhotoUrl: "${createBrandInput.logoPhotoUrl}",
              }
            ) {
              id,
              name,
              logoPhotoUrl,
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
        expect(errors[0].value).to.be.eql('A');
        expect(errors[0].constraints.minLength).to.be.eql('name must be longer than or equal to 2 characters');
        expect(errors[1].property).to.be.eql('logoPhotoUrl');
        expect(errors[1].value).to.be.eql('Wrong url');
        expect(errors[1].constraints.isUrl).to.be.eql('logoPhotoUrl must be an URL address');
      });

      it('if brand already exists', async () => {
        // Arrange
        const brandName: string = 'Audi';
        const existingBrand = new BrandBuilder()
            .withName(brandName)
            .build();
        const createBrandInput: CreateBrandInput = {
          name: brandName,
          logoPhotoUrl: 'https://test.logo.url.foo.bar/',
        };
        const country: Country = new CountryBuilder().build();
        const savedCountry: Country = await CountryDatabaseUtils.saveCountry(country);

        const query: string = `
          mutation {
            createBrand (
              countryId: ${savedCountry.id},
              createBrandInput: {
                name: "${createBrandInput.name}",
                logoPhotoUrl: "${createBrandInput.logoPhotoUrl}",
              }
            ) {
              id,
              name,
              logoPhotoUrl,
            }
          }
        `;

        await BrandDatabaseUtils.saveBrand(existingBrand);

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
            .post('/graphql')
            .send({ query })
            .expect(200);

        const error: ResponseError = response.body.errors[0];
        expect(error.message).to.be.eql(`Brand with name=${createBrandInput.name} already exists`);
        expect(error.extensions.code).to.be.eql('ENTITY_ALREADY_EXISTS');
      });

      it("if country doesn't exist", async () => {
        // Arrange
        const notExistingCountryId: number = 0;
        const brandName: string = 'Audi';
        const existingBrand = new BrandBuilder()
            .withName(brandName)
            .build();
        const createBrandInput: CreateBrandInput = {
          name: brandName,
          logoPhotoUrl: 'https://test.logo.url.foo.bar/',
        };

        const query: string = `
          mutation {
            createBrand (
              countryId: ${notExistingCountryId},
              createBrandInput: {
                name: "${createBrandInput.name}",
                logoPhotoUrl: "${createBrandInput.logoPhotoUrl}",
              }
            ) {
              id,
              name,
              logoPhotoUrl,
            }
          }
        `;

        await BrandDatabaseUtils.saveBrand(existingBrand);

        // Act & Assert
        const response: Response = await request(application.serverInfo.url)
            .post('/graphql')
            .send({ query })
            .expect(200);

        const error: ResponseError = response.body.errors[0];
        expect(error.message).to.be.eql(`Country with id=${notExistingCountryId} not found`);
        expect(error.extensions.code).to.be.eql('NOT_FOUND');
      });
    });
  });
});
