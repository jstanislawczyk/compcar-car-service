import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {PaintingService} from '../services/painting.service';
import {ColorService} from '../services/color.service';
import {PaintingColorFacade} from './painting-color.facade';
import {PaintingBuilder} from '../../test/utils/builders/painting.builder';
import {Painting} from '../models/entities/painting';
import {Color} from '../models/entities/color';
import {ColorBuilder} from '../../test/utils/builders/color.builder';
import {BrandBuilder} from '../../test/utils/builders/brand.builder';

use(sinonChai);
use(chaiAsPromised);

context('PaintingColorFacade', () => {

  let sandbox: SinonSandbox;
  let paintingServiceStub: SinonStubbedInstance<PaintingService>;
  let colorServiceStub: SinonStubbedInstance<ColorService>;
  let paintingColorFacade: PaintingColorFacade;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    paintingServiceStub = sandbox.createStubInstance(PaintingService);
    colorServiceStub = sandbox.createStubInstance(ColorService);

    paintingColorFacade = new PaintingColorFacade(
      paintingServiceStub as unknown as PaintingService,
      colorServiceStub as unknown as ColorService,
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('savePaintingWithColor', () => {
    it('should save painting', async () => {
      // Arrange
      const paintingToSave: Painting = new PaintingBuilder().build();
      const colorId: number = 1;
      const color: Color = new ColorBuilder()
          .withId(colorId)
          .build();
      const savedPainting: Painting = new PaintingBuilder(true).build();

      colorServiceStub.findColorById.resolves(color);
      paintingServiceStub.savePainting.resolves(savedPainting);

      // Act
      const returnedPainting: Painting = await paintingColorFacade.savePaintingWithColor(paintingToSave, colorId);

      // Assert
      expect(returnedPainting).to.be.eql(savedPainting);
      expect(colorServiceStub.findColorById).to.be.calledOnceWith(colorId);
      expect(paintingServiceStub.savePainting).to.be.calledOnceWith(paintingToSave);
    });

    it('should throw error if color is not found', async () => {
      // Arrange
      const colorId: number = 1;

      colorServiceStub.findColorById.rejects(new Error('FindOne error'));

      // Act
      const result: Promise<Painting> = paintingColorFacade.savePaintingWithColor(new BrandBuilder().build(), colorId);

      // Assert
      await expect(result).to.eventually
          .be.rejectedWith('FindOne error')
          .and.be.instanceOf(Error);
      expect(colorServiceStub.findColorById).to.be.calledOnceWith(colorId);
      expect(paintingServiceStub.savePainting).to.be.not.called;
    });

    it('should throw error if brand saving fails', async () => {
      // Arrange
      colorServiceStub.findColorById.resolves(new ColorBuilder().build());
      paintingServiceStub.savePainting.rejects(new Error('SavePainting error'));

      // Act
      const result: Promise<Painting> = paintingColorFacade.savePaintingWithColor(new BrandBuilder().build(), 1);

      // Assert
      await expect(result).to.eventually
          .be.rejectedWith('SavePainting error')
          .and.be.instanceOf(Error);
    });
  });
});
