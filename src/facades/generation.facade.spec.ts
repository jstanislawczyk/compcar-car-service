import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {GenerationFacade} from './generation.facade';
import {GenerationService} from '../services/generation.service';
import {GenerationBuilder} from '../../test/utils/builders/generation.builder';
import {Generation} from '../models/entities/generation';

use(sinonChai);
use(chaiAsPromised);

context('GenerationFacade', () => {

  let sandbox: SinonSandbox;
  let generationServiceStub: SinonStubbedInstance<GenerationService>;
  let generationFacade: GenerationFacade;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    generationServiceStub = sandbox.createStubInstance(GenerationService);

    generationFacade = new GenerationFacade(generationServiceStub);
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('findGenerationById', () => {
    it('should find generation by id', async () => {
      // Arrange
      const generationId: number = 1;
      const existingGeneration: Generation = new GenerationBuilder()
          .withId(generationId)
          .build();

      generationServiceStub.findOne.resolves(existingGeneration);

      // Act
      const returnedGeneration: Generation = await generationFacade.findGenerationById(generationId);

      // Assert
      expect(returnedGeneration).to.be.eql(existingGeneration);
      expect(generationServiceStub.findOne).to.be.calledOnceWith(generationId);
    });

    it('should rethrow error from generation service', async () => {
      // Arrange
      const generationId: number = 1;

      generationServiceStub.findOne.rejects(new Error('Not Found'));

      // Act
      const returnedGenerationResult: Promise<Generation> = generationFacade.findGenerationById(generationId);

      // Assert
      await expect(returnedGenerationResult).to.eventually
          .be.rejectedWith('Not Found')
          .and.to.be.an.instanceOf(Error);
      expect(generationServiceStub.findOne).to.be.calledOnceWith(generationId);
    });
  });
});
