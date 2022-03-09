import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {Generation} from '../models/entities/generation';
import {GenerationResolver} from './generation.resolver';
import {GenerationFacade} from '../facades/generation.facade';
import {GenerationBuilder} from '../../test/utils/builders/generation.builder';

use(sinonChai);
use(chaiAsPromised);

context('GenerationResolver', () => {

  let sandbox: SinonSandbox;
  let generationFacadeStub: SinonStubbedInstance<GenerationFacade>;
  let generationResolver: GenerationResolver;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    generationFacadeStub = sandbox.createStubInstance(GenerationFacade);

    generationResolver = new GenerationResolver(generationFacadeStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getGenerationById', () => {
    it('should find generation by id', async () => {
      // Arrange
      const generationId: number = 1;
      const existingGeneration: Generation = new GenerationBuilder()
          .withId(generationId)
          .build();

      generationFacadeStub.findGenerationById.resolves(existingGeneration);

      // Act
      const returnedGeneration: Generation = await generationResolver.getGenerationById(generationId);

      // Assert
      expect(returnedGeneration).to.be.eql(existingGeneration);
      expect(generationFacadeStub.findGenerationById).to.be.calledOnceWith(generationId);
    });

    it('should rethrow error from facade', async () => {
      // Arrange
      const generationId: number = 1;

      generationFacadeStub.findGenerationById.rejects(new Error('Not Found'));

      // Act
      const returnedGenerationResult: Promise<Generation> = generationResolver.getGenerationById(generationId);

      // Assert
      await expect(returnedGenerationResult).to.eventually
          .be.rejectedWith('Not Found')
          .and.to.be.an.instanceOf(Error);
      expect(generationFacadeStub.findGenerationById).to.be.calledOnceWith(generationId);
    });
  });
});
