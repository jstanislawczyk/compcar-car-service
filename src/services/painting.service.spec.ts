import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {PaintingRepository} from '../repositories/painting.repository';
import {PaintingService} from './painting.service';
import {Painting} from '../models/entities/painting';
import {PaintingBuilder} from '../../test/utils/builders/painting.builder';

use(sinonChai);
use(chaiAsPromised);

context('PaintingService', () => {

  let sandbox: SinonSandbox;
  let paintingRepositoryStub: SinonStubbedInstance<PaintingRepository>;
  let paintingService: PaintingService;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    paintingRepositoryStub = sandbox.createStubInstance(PaintingRepository);
    paintingService = new PaintingService(paintingRepositoryStub as unknown as PaintingRepository);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('savePainting', () => {
    it('should save painting', async () => {
      // Arrange
      const paintingToSave: Painting = new PaintingBuilder().build();
      const savedPainting: Painting = new PaintingBuilder()
        .withId(1)
        .build();

      paintingRepositoryStub.save.resolves(savedPainting);

      // Act
      const savePaintingResult: Painting = await paintingService.savePainting(paintingToSave);

      // Assert
      expect(savePaintingResult).to.be.eql(savedPainting);
      expect(paintingRepositoryStub.save).to.be.calledOnceWith(paintingToSave);
    });

    it('should throw error coming from repository', async () => {
      // Arrange
      paintingRepositoryStub.save.rejects(new Error('Save error'));

      // Act
      const savePaintingResult: Promise<Painting> = paintingService.savePainting(new PaintingBuilder().build());

      // Assert
      await expect(savePaintingResult).to.eventually
          .be.rejectedWith('Save error')
          .and.be.instanceOf(Error);
    });
  });
});
