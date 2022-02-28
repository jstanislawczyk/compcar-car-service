import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {ColorRepository} from '../repositories/color.repository';
import {ColorService} from './color.service';
import {Color} from '../models/entities/color';
import {ColorBuilder} from '../../test/utils/builders/color.builder';
import {EntityAlreadyExistsError} from '../models/errors/entity-already-exists.error';

use(sinonChai);
use(chaiAsPromised);

context('ColorService', () => {

  let sandbox: SinonSandbox;
  let colorRepositoryStub: SinonStubbedInstance<ColorRepository>;
  let colorService: ColorService;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    colorRepositoryStub = sandbox.createStubInstance(ColorRepository);
    colorService = new ColorService(colorRepositoryStub);

    colorRepositoryStub.find.resolves([]);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findAll', () => {
    it('should get colors list', async () => {
      // Arrange
      const colorsList: Color[] = [
        new ColorBuilder(true).build(),
        new ColorBuilder(true)
          .withName('blue')
          .withHexCode('#00F')
          .build(),
      ];

      colorRepositoryStub.find.resolves(colorsList);

      // Act
      const colorsResult: Color[] = await colorService.findAll();

      // Assert
      expect(colorsResult).to.be.have.length(2);
      expect(colorsResult[0]).to.be.eql(colorsList[0]);
      expect(colorsResult[1]).to.be.eql(colorsList[1]);
      expect(colorRepositoryStub.find).to.be.calledOnce;
    });

    it('should throw error', async () => {
      // Arrange
      colorRepositoryStub.find.rejects(new Error('Find error'));

      // Act
      const colorsResult: Promise<Color[]> = colorService.findAll();

      // Assert
      await expect(colorsResult).to.eventually.be.rejectedWith('Find error');
    });
  });

  describe('saveColor', () => {
    it('should save color', async () => {
      // Arrange
      const colorToSave: Color = new ColorBuilder().build();
      const savedColor: Color = new ColorBuilder()
        .withId(1)
        .build();

      colorRepositoryStub.save.resolves(savedColor);

      // Act
      const saveColorResult: Color = await colorService.saveColor(colorToSave);

      // Assert
      expect(saveColorResult).to.be.eql(savedColor);
      expect(colorRepositoryStub.find).to.be.calledOnceWith({
        select: ['id'],
        where: [
          { name: colorToSave.name },
          { hexCode: colorToSave.hexCode },
        ],
      });
      expect(colorRepositoryStub.save).to.be.calledOnceWith(colorToSave);
    });

    describe('should throw error', () => {
      it('if color or hexCode already exists', async () => {
        // Arrange
        colorRepositoryStub.find.resolves([new ColorBuilder().build()]);

        // Act
        const saveColorResult: Promise<Color> = colorService.saveColor(new ColorBuilder().build());

        // Assert
        await expect(saveColorResult).to.eventually.be
          .rejectedWith('Color with given name or hex code already exists')
          .and.be.an.instanceOf(EntityAlreadyExistsError);
      });

      it('coming from repository', async () => {
        // Arrange
        colorRepositoryStub.save.rejects(new Error('Save error'));

        // Act
        const saveColorResult: Promise<Color> = colorService.saveColor(new ColorBuilder().build());

        // Assert
        await expect(saveColorResult).to.eventually.be.rejectedWith('Save error');
      });
    });
  });
});
