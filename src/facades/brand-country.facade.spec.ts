import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {BrandCountryFacade} from './brand-country.facade';
import {BrandService} from '../services/brand.service';
import {CountryService} from '../services/country.service';
import {CountryBuilder} from '../../test/utils/builders/country.builder';
import {BrandBuilder} from '../../test/utils/builders/brand.builder';
import {Brand} from '../models/entities/brand';
import {Country} from '../models/entities/country';

use(sinonChai);
use(chaiAsPromised);

context('BrandCountryFacade', () => {

  let sandbox: SinonSandbox;
  let brandServiceStub: SinonStubbedInstance<BrandService>;
  let countryServiceStub: SinonStubbedInstance<CountryService>;
  let brandCountryFacade: BrandCountryFacade;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    brandServiceStub = sandbox.createStubInstance(BrandService);
    countryServiceStub = sandbox.createStubInstance(CountryService);

    brandCountryFacade = new BrandCountryFacade(brandServiceStub, countryServiceStub);
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('findOne', () => {
    it('should find brand by id', async () => {
      // Arrange
      const brandId: number = 1;
      const existingBrand: Brand = new BrandBuilder()
          .withId(brandId)
          .build();

      brandServiceStub.findOne.resolves(existingBrand);

      // Act
      const returnedBrand: Brand = await brandCountryFacade.findOne(brandId);

      // Assert
      expect(returnedBrand).to.be.eql(existingBrand);
      expect(brandServiceStub.findOne).to.be.calledOnceWith(brandId);
    });

    it('should rethrow error from service', async () => {
      // Arrange
      const brandId: number = 1;

      brandServiceStub.findOne.rejects(new Error('Not Found'));

      // Act
      const returnedBrandResult: Promise<Brand> = brandCountryFacade.findOne(brandId);

      // Assert
      await expect(returnedBrandResult).to.eventually
          .be.rejectedWith('Not Found')
          .and.to.be.an.instanceOf(Error);
      expect(brandServiceStub.findOne).to.be.calledOnceWith(brandId);
    });
  });

  describe('saveBrandWithCountry', () => {
    it('should save brand', async () => {
      // Arrange
      const brandToSave: Brand = new BrandBuilder().build();
      const countryId: number = 1;
      const country: Country = new CountryBuilder()
          .withId(countryId)
          .build();
      const savedBrand: Brand = new BrandBuilder(true).build();

      countryServiceStub.findCountryById.resolves(country);
      brandServiceStub.saveBrand.resolves(savedBrand);

      // Act
      const returnedBrand: Brand = await brandCountryFacade.saveBrandWithCountry(brandToSave, countryId);

      // Assert
      expect(returnedBrand).to.be.eql(savedBrand);
      expect(countryServiceStub.findCountryById).to.be.calledOnceWith(countryId);
      expect(brandServiceStub.saveBrand).to.be.calledOnceWith(brandToSave);
    });

    it('should throw error if country is not found', async () => {
      // Arrange
      const userId: number = 1;

      countryServiceStub.findCountryById.rejects(new Error('FindOne error'));

      // Act
      const result: Promise<Brand> = brandCountryFacade.saveBrandWithCountry(new BrandBuilder().build(), 1);

      // Assert
      await expect(result).to.eventually
          .be.rejectedWith('FindOne error')
          .and.be.instanceOf(Error);
      expect(countryServiceStub.findCountryById).to.be.calledOnceWith(userId);
      expect(brandServiceStub.saveBrand).to.be.not.called;
    });

    it('should throw error if brand saving fails', async () => {
      // Arrange
      countryServiceStub.findCountryById.resolves(new CountryBuilder().build());
      brandServiceStub.saveBrand.rejects(new Error('SaveBrand error'));

      // Act
      const result: Promise<Brand> = brandCountryFacade.saveBrandWithCountry(new BrandBuilder().build(), 1);

      // Assert
      await expect(result).to.eventually
          .be.rejectedWith('SaveBrand error')
          .and.be.instanceOf(Error);
    });
  });
});
