import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {EntityAlreadyExistsError} from '../models/errors/entity-already-exists.error';
import {CountryRepository} from '../repositories/country.repository';
import {CountryService} from './country.service';
import {CountryBuilder} from '../../test/utils/builders/country.builder';
import {Country} from '../models/entities/country';
import {NotFoundError} from '../models/errors/not-found.error';

use(sinonChai);
use(chaiAsPromised);

context('CountryService', () => {

  let sandbox: SinonSandbox;
  let countryRepositoryStub: SinonStubbedInstance<CountryRepository>;
  let countryService: CountryService;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    countryRepositoryStub = sandbox.createStubInstance(CountryRepository);
    countryService = new CountryService(countryRepositoryStub);

    countryRepositoryStub.findOne.resolves(undefined);
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('findCountryById', () => {
    it('should find country', async () => {
      // Arrange
      const id: number = 1;
      const country: Country = new CountryBuilder(true)
          .withId(id)
          .build();

      countryRepositoryStub.findOneOrFail.resolves(country);

      // Act
      const returnedCountry: Country = await countryService.findCountryById(id);

      // Assert
      expect(returnedCountry).to.be.eql(country);
      expect(countryRepositoryStub.findOneOrFail).to.be.calledOnceWith(id);
    });

    it('should throw an error if country was not found', async () => {
      // Arrange
      const id: number = 1;

      countryRepositoryStub.findOneOrFail.rejects(new Error('FindOne error'));

      // Act
      const result: Promise<Country> = countryService.findCountryById(id);

      // Assert
      await expect(result).to.be.eventually.rejectedWith(NotFoundError, `Country with id=${id} not found`);
    });
  });

  describe('saveCountry', () => {
    it('should save country', async () => {
      // Arrange
      const countryToSave: Country = new CountryBuilder().build();
      const savedCountry: Country = new CountryBuilder()
        .withId(1)
        .build();

      countryRepositoryStub.save.resolves(savedCountry);

      // Act
      const saveCountryResult: Country = await countryService.saveCountry(countryToSave);

      // Assert
      expect(saveCountryResult).to.be.eql(savedCountry);
      expect(countryRepositoryStub.findOne).to.be.calledOnceWith({
        select: ['id'],
        where: {
          name: countryToSave.name,
        },
      });
      expect(countryRepositoryStub.save).to.be.calledOnceWith(countryToSave);
    });

    describe('should throw error', () => {
      it('if country name already exists', async () => {
        // Arrange
        const countryToSave: Country = new CountryBuilder().build();

        countryRepositoryStub.findOne.resolves(countryToSave);

        // Act
        const saveCountryResult: Promise<Country> = countryService.saveCountry(new CountryBuilder().build());

        // Assert
        await expect(saveCountryResult).to.eventually.be
          .rejectedWith(`Country with name=${countryToSave.name} already exists`)
          .and.be.an.instanceOf(EntityAlreadyExistsError);
      });

      it('coming from repository', async () => {
        // Arrange
        countryRepositoryStub.save.rejects(new Error('Save error'));

        // Act
        const saveCountryResult: Promise<Country> = countryService.saveCountry(new CountryBuilder().build());

        // Assert
        await expect(saveCountryResult).to.eventually.be.rejectedWith('Save error');
      });
    });
  });
});
