import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {Brand} from '../models/entities/brand';
import {BrandResolver} from './brand.resolver';
import {BrandCountryFacade} from '../facades/brand-country.facade';
import {BrandMapper} from '../mapper/brand.mapper';
import {BrandBuilder} from '../../test/utils/builders/brand.builder';
import {CreateBrandInput} from '../models/inputs/brand/create-brand.input';

use(sinonChai);
use(chaiAsPromised);

context('BrandResolver', () => {

  let sandbox: SinonSandbox;
  let brandCountryFacadeStub: SinonStubbedInstance<BrandCountryFacade>;
  let brandMapperStub: SinonStubbedInstance<BrandMapper>;
  let brandResolver: BrandResolver;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    brandCountryFacadeStub = sandbox.createStubInstance(BrandCountryFacade);
    brandMapperStub = sandbox.createStubInstance(BrandMapper);

    brandResolver = new BrandResolver(
      brandCountryFacadeStub as unknown as BrandCountryFacade,
      brandMapperStub as unknown as BrandMapper,
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getBrandById', () => {
    it('should find brand by id', async () => {
      // Arrange
      const brandId: number = 1;
      const existingBrand: Brand = new BrandBuilder()
          .withId(brandId)
          .build();

      brandCountryFacadeStub.findOne.resolves(existingBrand);

      // Act
      const returnedBrand: Brand = await brandResolver.getBrandById(brandId);

      // Assert
      expect(returnedBrand).to.be.eql(existingBrand);
      expect(brandCountryFacadeStub.findOne).to.be.calledOnceWith(brandId);
    });

    it("should rethrow error from facade", async () => {
      // Arrange
      const brandId: number = 1;

      brandCountryFacadeStub.findOne.rejects(new Error('Not Found'));

      // Act
      const returnedBrandResult: Promise<Brand> = brandResolver.getBrandById(brandId);

      // Assert
      await expect(returnedBrandResult).to.eventually
          .be.rejectedWith('Not Found')
          .and.to.be.an.instanceOf(Error);
      expect(brandCountryFacadeStub.findOne).to.be.calledOnceWith(brandId);
    });
  });

  describe('createBrand', () => {
    it('should create brand', async () => {
      // Arrange
      const mappedBrand: Brand = new BrandBuilder().build();
      const savedBrand: Brand = new BrandBuilder(true).build();
      const createBrandInput: CreateBrandInput = {
        name: 'Audi',
        logoPhotoUrl: 'https://test.flag.url.foo.bar/',
      };

      brandMapperStub.toEntity.returns(mappedBrand);
      brandCountryFacadeStub.saveBrandWithCountry.resolves(savedBrand);

      // Act
      const returnedBrand: Brand = await brandResolver.createBrand(1, createBrandInput);

      // Assert
      expect(returnedBrand).to.be.eql(savedBrand);
      expect(brandMapperStub.toEntity).to.be.calledOnceWith(createBrandInput);
      expect(brandCountryFacadeStub.saveBrandWithCountry).to.be.calledOnceWith(mappedBrand);
    });

    it('should throw error if brand saving fails', async () => {
      // Arrange
      const mappedBrand: Brand = new BrandBuilder().build();
      const createBrandInput: CreateBrandInput = {
        name: 'Audi',
        logoPhotoUrl: 'https://test.flag.url.foo.bar/',
      };

      brandMapperStub.toEntity.returns(mappedBrand);
      brandCountryFacadeStub.saveBrandWithCountry.rejects(new Error('SaveBrand error'));

      // Act
      const result: Promise<Brand> = brandResolver.createBrand(1, createBrandInput);

      // Assert
      await expect(result).to.eventually.be.rejectedWith('SaveBrand error');
    });
  });
});
