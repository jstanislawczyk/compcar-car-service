import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {PaintingColorFacade} from '../facades/painting-color.facade';
import {PaintingMapper} from '../mapper/painting.mapper';
import {PaintingResolver} from './painting.resolver';
import {Painting} from '../models/entities/painting';
import {PaintingBuilder} from '../../test/utils/builders/painting.builder';
import {PaintingCreateInput} from '../models/inputs/painting/painting-create.input';

use(sinonChai);
use(chaiAsPromised);

context('PaintingResolver', () => {

  let sandbox: SinonSandbox;
  let paintingColorFacadeStub: SinonStubbedInstance<PaintingColorFacade>;
  let paintingMapperStub: SinonStubbedInstance<PaintingMapper>;
  let paintingResolver: PaintingResolver;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    paintingColorFacadeStub = sandbox.createStubInstance(PaintingColorFacade);
    paintingMapperStub = sandbox.createStubInstance(PaintingMapper);

    paintingResolver = new PaintingResolver(
      paintingColorFacadeStub as unknown as PaintingColorFacade,
      paintingMapperStub as unknown as PaintingMapper,
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createPainting', () => {
    it('should create painting', async () => {
      // Arrange
      const colorId: number = 1;
      const mappedPainting: Painting = new PaintingBuilder().build();
      const savedPainting: Painting = new PaintingBuilder(true).build();
      const paintingCreateInput: PaintingCreateInput = {
        price: 123.45,
      };

      paintingMapperStub.toEntity.returns(mappedPainting);
      paintingColorFacadeStub.savePaintingWithColor.resolves(savedPainting);

      // Act
      const returnedPainting: Painting = await paintingResolver.createPainting(colorId, paintingCreateInput);

      // Assert
      expect(returnedPainting).to.be.eql(savedPainting);
      expect(paintingMapperStub.toEntity).to.be.calledOnceWith(paintingCreateInput);
      expect(paintingColorFacadeStub.savePaintingWithColor).to.be.calledOnceWith(mappedPainting);
    });

    it('should throw error if painting saving fails', async () => {
      // Arrange
      const colorId: number = 1;
      const mappedPainting: Painting = new PaintingBuilder().build();
      const paintingCreateInput: PaintingCreateInput = {
        price: 123.45,
      };

      paintingMapperStub.toEntity.returns(mappedPainting);
      paintingColorFacadeStub.savePaintingWithColor.rejects(new Error('SavePainting error'));

      // Act
      const returnedPaintingResult: Promise<Painting> = paintingResolver.createPainting(colorId, paintingCreateInput);

      // Assert
      await expect(returnedPaintingResult).to.eventually
          .be.rejectedWith('SavePainting error')
          .and.be.an.instanceOf(Error);
    });
  });
});
