import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {CountryService} from '../services/country.service';
import {CountryMapper} from '../mapper/country.mapper';
import {CountryResolver} from './country.resolver';
import {Country} from '../models/entities/country';
import {CountryBuilder} from '../../test/utils/builders/country.builder';
import {CountryCreateInput} from '../models/inputs/country/country-create.input';

use(sinonChai);
use(chaiAsPromised);

context('CountryResolver', () => {

  let sandbox: SinonSandbox;
  let countryServiceStub: SinonStubbedInstance<CountryService>;
  let countryMapperStub: SinonStubbedInstance<CountryMapper>;
  let countryResolver: CountryResolver;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    countryServiceStub = sandbox.createStubInstance(CountryService);
    countryMapperStub = sandbox.createStubInstance(CountryMapper);

    countryResolver = new CountryResolver(
      countryServiceStub as unknown as CountryService,
      countryMapperStub as unknown as CountryMapper,
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createCountry', () => {
    it('should create country', async () => {
      // Arrange
      const mappedCountry: Country = new CountryBuilder().build();
      const savedCountry: Country = new CountryBuilder(true).build();
      const countryCreateInput: CountryCreateInput = {
        name: 'Poland',
        flagPhotoUrl: 'https://test.url.foo.bar/',
      };

      countryMapperStub.toEntity.returns(mappedCountry);
      countryServiceStub.saveCountry.resolves(savedCountry);

      // Act
      const returnedCountry: Country = await countryResolver.createCountry(countryCreateInput);

      // Assert
      expect(returnedCountry).to.be.eql(savedCountry);
      expect(countryMapperStub.toEntity).to.be.calledOnceWith(countryCreateInput);
      expect(countryServiceStub.saveCountry).to.be.calledOnceWith(mappedCountry);
    });

    it('should throw error if country saving fails', async () => {
      // Arrange
      const mappedCountry: Country = new CountryBuilder().build();
      const countryCreateInput: CountryCreateInput = {
        name: 'Poland',
        flagPhotoUrl: 'https://test.url.foo.bar/',
      };

      countryMapperStub.toEntity.returns(mappedCountry);
      countryServiceStub.saveCountry.rejects(new Error('SaveCountry error'));

      // Act
      const returnedCountryResult: Promise<Country> = countryResolver.createCountry(countryCreateInput);

      // Assert
      await expect(returnedCountryResult).to.eventually.be.rejectedWith('SaveCountry error');
    });
  });
});
