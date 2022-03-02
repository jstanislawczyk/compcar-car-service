import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {NotFoundError} from '../models/errors/not-found.error';
import {GenerationRepository} from '../repositories/generation.repository';
import {GenerationService} from './generation.service';
import {GenerationBuilder} from '../../test/utils/builders/generation.builder';
import {Generation} from '../models/entities/generation';

use(sinonChai);
use(chaiAsPromised);

context('GenerationService', () => {

  let sandbox: SinonSandbox;
  let generationRepositoryStub: SinonStubbedInstance<GenerationRepository>;
  let generationService: GenerationService;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    generationRepositoryStub = sandbox.createStubInstance(GenerationRepository);
    generationService = new GenerationService(generationRepositoryStub);

    generationRepositoryStub.findOne.resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findOne', () => {
    it('should find generation by id', async () => {
      // Arrange
      const generationId: number = 1;
      const existingGeneration: Generation = new GenerationBuilder()
          .withId(generationId)
          .build();

      generationRepositoryStub.findOneOrFail.resolves(existingGeneration);

      // Act
      const returnedGeneration: Generation = await generationService.findOne(generationId);

      // Assert
      expect(returnedGeneration).to.be.eql(existingGeneration);
      expect(generationRepositoryStub.findOneOrFail).to.be.calledOnceWith(generationId);
    });

    it("should throw error if generation doesn't exist", async () => {
      // Arrange
      const generationId: number = 1;

      generationRepositoryStub.findOneOrFail.rejects(new Error('Not Found'));

      // Act
      const returnedGenerationResult: Promise<Generation> = generationService.findOne(generationId);

      // Assert
      await expect(returnedGenerationResult).to.eventually
          .be.rejectedWith(`Generation with id=${generationId} not found`)
          .and.to.be.an.instanceOf(NotFoundError);
      expect(generationRepositoryStub.findOneOrFail).to.be.calledOnceWith(generationId);
    });
  });
});
