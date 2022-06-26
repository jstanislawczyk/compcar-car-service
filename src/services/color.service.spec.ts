import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {ColorRepository} from '../repositories/color.repository';
import {ColorService} from './color.service';
import {Color} from '../models/entities/color';
import {ColorBuilder} from '../../test/utils/builders/color.builder';
import {NotFoundError} from '../models/errors/not-found.error';
import {ColorUpdate} from '../models/common/update/color.update';
import {DuplicateEntryError} from '../models/errors/duplicate-entry.error';

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
      const hexCode: string = '#F00';
      const colorToSave: Color = new ColorBuilder()
          .withHexCode(hexCode)
          .build();
      const savedColor: Color = new ColorBuilder()
          .withId(1)
          .build();

      colorRepositoryStub.save.resolves(savedColor);

      // Act
      const saveColorResult: Color = await colorService.saveColor(colorToSave);

      // Assert
      expect(saveColorResult).to.be.eql(savedColor);
      expect(colorRepositoryStub.save).to.be.calledOnceWith({
        name: colorToSave.name,
        hexCode: colorToSave.hexCode,
      });
    });

    describe('should throw error', () => {
      it('duplicated entry error', async () => {
        // Arrange
        const errorMessage: string = `Duplicate entry 'red' for key 'color.IDX_123'`;

        colorRepositoryStub.save.rejects({
          code: 'ER_DUP_ENTRY',
          message: errorMessage,
        });

        // Act
        const saveColorResult: Promise<Color> = colorService.saveColor(new ColorBuilder().build());

        // Assert
        await expect(saveColorResult).to.eventually.be
          .rejectedWith("Value 'red' already exists")
          .and.be.an.instanceOf(DuplicateEntryError);
      });

      it('coming from repository', async () => {
        // Arrange
        colorRepositoryStub.save.rejects(new Error('Save error'));

        // Act
        const saveColorResult: Promise<Color> = colorService.saveColor(new ColorBuilder().build());

        // Assert
        await expect(saveColorResult).to.eventually.be
            .rejectedWith('Save error')
            .and.be.an.instanceOf(Error);
      });
    });
  });

  describe('updateColor', () => {
    describe('should update color', () => {
      it('with all properties', async () => {
        // Arrange
        const id: number = 1;
        const newName: string = 'NewName';
        const newHexCode: string = '#F00';
        const colorUpdate: ColorUpdate = {
          id,
          name: newName,
          hexCode: newHexCode,
        };
        const existingColor: Color = new ColorBuilder()
            .withId(id)
            .withName('OldName')
            .withHexCode('#FFF')
            .build();
        const updatedColor: Color = new ColorBuilder()
            .withId(id)
            .withName(newName)
            .withHexCode(newHexCode)
            .build();

        colorRepositoryStub.findOne.resolves(existingColor);
        colorRepositoryStub.save.resolves(updatedColor);

        // Act
        const returnedColor: Color = await colorService.updateColor(colorUpdate);

        // Assert
        expect(returnedColor).to.be.eql(updatedColor);
        expect(colorRepositoryStub.findOne).to.be.calledOnceWith(colorUpdate.id);
        expect(colorRepositoryStub.save).to.be.calledOnceWith({
          id: existingColor.id,
          name: newName,
          hexCode: newHexCode,
        });
      });

      it('with single optional property', async () => {
        // Arrange
        const id: number = 1;
        const newName: string = 'NewName';
        const colorUpdate: ColorUpdate = {
          id,
          name: newName,
        };
        const existingColor: Color = new ColorBuilder()
            .withId(id)
            .withName('OldName')
            .withHexCode('#FFF')
            .build();
        const updatedColor: Color = new ColorBuilder()
            .withId(id)
            .withName(newName)
            .withHexCode(existingColor.hexCode)
            .build();

        colorRepositoryStub.findOne.resolves(existingColor);
        colorRepositoryStub.save.resolves(updatedColor);

        // Act
        const returnedColor: Color = await colorService.updateColor(colorUpdate);

        // Assert
        expect(returnedColor).to.be.eql(updatedColor);
        expect(colorRepositoryStub.findOne).to.be.calledOnceWith(colorUpdate.id);
        expect(colorRepositoryStub.save).to.be.calledOnceWith({
          id: existingColor.id,
          name: newName,
          hexCode: existingColor.hexCode,
        });
      });

      it('with required properties only', async () => {
        // Arrange
        const id: number = 1;
        const colorUpdate: ColorUpdate = {
          id,
        };
        const existingColor: Color = new ColorBuilder()
            .withId(id)
            .withName('ColorName')
            .withHexCode('#F00')
            .build();
        const updatedColor: Color = new ColorBuilder()
            .withId(id)
            .build();

        colorRepositoryStub.findOne.resolves(existingColor);
        colorRepositoryStub.save.resolves(updatedColor);

        // Act
        const returnedColor: Color = await colorService.updateColor(colorUpdate);

        // Assert
        expect(returnedColor).to.be.eql(updatedColor);
        expect(colorRepositoryStub.findOne).to.be.calledOnceWith(colorUpdate.id);
        expect(colorRepositoryStub.save).to.be.calledOnceWith({
          id: existingColor.id,
          name: existingColor.name,
          hexCode: existingColor.hexCode,
        });
      });
    });

    describe('should throw error', () => {
      it("if color doesn't exist", async () => {
        // Arrange
        const colorUpdate: ColorUpdate = {
          id: 1,
        };

        colorRepositoryStub.findOne.resolves(undefined);

        // Act
        const updateColorResult: Promise<Color> = colorService.updateColor(colorUpdate);

        // Assert
        await expect(updateColorResult).to.eventually.be
            .rejectedWith(`Color with id=${colorUpdate.id} not found`)
            .and.be.an.instanceOf(NotFoundError);
      });

      it('duplicated entry error', async () => {
        // Arrange
        const errorMessage: string = `Duplicate entry 'red' for key 'color.IDX_123'`;
        const colorUpdate: ColorUpdate = {
          id: 1,
        };

        colorRepositoryStub.findOne.resolves(new ColorBuilder().build());
        colorRepositoryStub.save.rejects({
          code: 'ER_DUP_ENTRY',
          message: errorMessage,
        });

        // Act
        const updateColorResult: Promise<Color> = colorService.updateColor(colorUpdate);

        // Assert
        await expect(updateColorResult).to.eventually.be
          .rejectedWith("Value 'red' already exists")
          .and.be.an.instanceOf(DuplicateEntryError);
      });

      it('coming from ColorRepository save method', async () => {
        // Arrange
        const colorUpdate: ColorUpdate = {
          id: 1,
        };

        colorRepositoryStub.findOne.resolves(new ColorBuilder().build());
        colorRepositoryStub.save.rejects(new Error('Save error'));

        // Act
        const updateColorResult: Promise<Color> = colorService.updateColor(colorUpdate);

        // Assert
        await expect(updateColorResult).to.eventually.be
            .rejectedWith('Save error')
            .and.be.an.instanceOf(Error);
      });
    });
  });
});
