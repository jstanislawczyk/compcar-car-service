import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {EntityAlreadyExistsError} from '../models/errors/entity-already-exists.error';
import {BrandRepository} from '../repositories/brand.repository';
import {BrandService} from './brand.service';
import {Brand} from '../models/entities/brand';
import {BrandBuilder} from '../../test/utils/builders/brand.builder';
import {NotFoundError} from '../models/errors/not-found.error';

use(sinonChai);
use(chaiAsPromised);

context('BrandService', () => {

  let sandbox: SinonSandbox;
  let brandRepositoryStub: SinonStubbedInstance<BrandRepository>;
  let brandService: BrandService;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    brandRepositoryStub = sandbox.createStubInstance(BrandRepository);
    brandService = new BrandService(brandRepositoryStub as unknown as BrandRepository);

    brandRepositoryStub.findOne.resolves(undefined);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findOne', () => {
    it('should find brand by id', async () => {
      // Arrange
      const brandId: number = 1;
      const existingBrand: Brand = new BrandBuilder()
          .withId(brandId)
          .build();

      brandRepositoryStub.findOneOrFail.resolves(existingBrand);

      // Act
      const returnedBrand: Brand = await brandService.findOne(brandId);

      // Assert
      expect(returnedBrand).to.be.eql(existingBrand);
      expect(brandRepositoryStub.findOneOrFail).to.be.calledOnceWith(brandId);
    });

    it("should throw error if brand doesn't exist", async () => {
      // Arrange
      const brandId: number = 1;

      brandRepositoryStub.findOneOrFail.rejects(new Error('Not Found'));

      // Act
      const returnedBrandResult: Promise<Brand> = brandService.findOne(brandId);

      // Assert
      await expect(returnedBrandResult).to.eventually
          .be.rejectedWith(`Brand with id=${brandId} not found`)
          .and.to.be.an.instanceOf(NotFoundError);
      expect(brandRepositoryStub.findOneOrFail).to.be.calledOnceWith(brandId);
    });
  });

  describe('saveBrand', () => {
    it('should save brand', async () => {
      // Arrange
      const brandToSave: Brand = new BrandBuilder().build();
      const savedBrand: Brand = new BrandBuilder()
        .withId(1)
        .build();

      brandRepositoryStub.save.resolves(savedBrand);

      // Act
      const saveBrandResult: Brand = await brandService.saveBrand(brandToSave);

      // Assert
      expect(saveBrandResult).to.be.eql(savedBrand);
      expect(brandRepositoryStub.findOne).to.be.calledOnceWith({
        select: ['id'],
        where: {
          name: brandToSave.name,
        },
      });
      expect(brandRepositoryStub.save).to.be.calledOnceWith(brandToSave);
    });

    describe('should throw error', () => {
      it('if brand name already exists', async () => {
        // Arrange
        const brandToSave: Brand = new BrandBuilder().build();

        brandRepositoryStub.findOne.resolves(brandToSave);

        // Act
        const saveCountryResult: Promise<Brand> = brandService.saveBrand(new BrandBuilder().build());

        // Assert
        await expect(saveCountryResult).to.eventually.be
          .rejectedWith(`Brand with name=${brandToSave.name} already exists`)
          .and.be.an.instanceOf(EntityAlreadyExistsError);
      });

      it('coming from repository', async () => {
        // Arrange
        brandRepositoryStub.save.rejects(new Error('Save error'));

        // Act
        const saveBrandResult: Promise<Brand> = brandService.saveBrand(new BrandBuilder().build());

        // Assert
        await expect(saveBrandResult).to.eventually.be.rejectedWith('Save error');
      });
    });
  });
});
