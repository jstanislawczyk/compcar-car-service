import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {ColorService} from '../services/color.service';
import {ColorMapper} from '../mapper/color.mapper';
import {ColorResolver} from './color.resolver';
import {ColorBuilder} from '../../test/utils/builders/color.builder';
import {Color} from '../models/entities/color';
import {CreateColorInput} from '../models/inputs/color/create-color.input';
import {UpdateColorInput} from '../models/inputs/color/update-color.input';
import {ColorUpdate} from '../models/common/update/color.update';

use(sinonChai);
use(chaiAsPromised);

context('ColorResolver', () => {

  let sandbox: SinonSandbox;
  let colorServiceStub: SinonStubbedInstance<ColorService>;
  let colorMapperStub: SinonStubbedInstance<ColorMapper>;
  let colorResolver: ColorResolver;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    colorServiceStub = sandbox.createStubInstance(ColorService);
    colorMapperStub = sandbox.createStubInstance(ColorMapper);

    colorResolver = new ColorResolver(colorServiceStub, colorMapperStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getColors', () => {
    it('should return colors list', async () => {
      // Arrange
      const savedColors: Color[] = [
        new ColorBuilder().build(),
        new ColorBuilder(true)
          .withName('blue')
          .withHexCode('#00F')
          .build(),
      ];

      colorServiceStub.findAll.resolves(savedColors);

      // Act
      const colors: Color[] = await colorResolver.getColors();

      // Assert
      expect(colors).to.have.length(2);
      expect(colors).to.be.eql(savedColors);
    });

    it('should throw error', async () => {
      // Arrange
      colorServiceStub.findAll.rejects(new Error('FindAll error'));

      // Act
      const findAllColorsResult: Promise<Color[]> = colorResolver.getColors();

      // Assert
      await expect(findAllColorsResult).to.eventually.be.rejectedWith('FindAll error');
    });
  });

  describe('createColor', () => {
    it('should create color', async () => {
      // Arrange
      const mappedColor: Color = new ColorBuilder().build();
      const savedColor: Color = new ColorBuilder(true).build();
      const createColorInput: CreateColorInput = {
        name: 'green',
        hexCode: '#0F0',
      };

      colorMapperStub.toEntity.returns(mappedColor);
      colorServiceStub.saveColor.resolves(savedColor);

      // Act
      const returnedColor: Color = await colorResolver.createColor(createColorInput);

      // Assert
      expect(returnedColor).to.be.eql(savedColor);
      expect(colorMapperStub.toEntity).to.be.calledOnceWith(createColorInput);
      expect(colorServiceStub.saveColor).to.be.calledOnceWith(mappedColor);
    });

    it('should throw error if color saving fails', async () => {
      // Arrange
      const mappedColor: Color = new ColorBuilder().build();
      const createColorInput: CreateColorInput = {
        name: 'green',
        hexCode: '#0F0',
      };

      colorMapperStub.toEntity.returns(mappedColor);
      colorServiceStub.saveColor.rejects(new Error('SaveColor error'));

      // Act
      const returnedColorResult: Promise<Color> = colorResolver.createColor(createColorInput);

      // Assert
      await expect(returnedColorResult).to.eventually.be.rejectedWith('SaveColor error');
    });
  });

  describe('updateColor', () => {
    it('should update color', async () => {
      // Arrange
      const name: string = 'NewColor';
      const hexCode: string = '#F00';
      const mappedColorUpdate: ColorUpdate = {
        id: 1,
        name,
        hexCode,
      };
      const updatedColor: Color = new ColorBuilder(true)
          .withName('NewColor')
          .build();
      const updateColorInput: UpdateColorInput = {
        id: mappedColorUpdate.id,
        name: mappedColorUpdate.name,
        hexCode: mappedColorUpdate.hexCode,
      };

      colorMapperStub.toUpdateModel.returns(mappedColorUpdate);
      colorServiceStub.updateColor.resolves(updatedColor);

      // Act
      const returnedColor: Color = await colorResolver.updateColor(updateColorInput);

      // Assert
      expect(returnedColor).to.be.eql(updatedColor);
      expect(colorMapperStub.toUpdateModel).to.be.calledOnceWith(updateColorInput);
      expect(colorServiceStub.updateColor).to.be.calledOnceWith(mappedColorUpdate);
    });

    it('should throw error if color updating fails', async () => {
      // Arrange
      const mappedColorUpdate: ColorUpdate = {
        id: 1,
      };
      const updateColorInput: UpdateColorInput = {
        id: 1,
      };

      colorMapperStub.toUpdateModel.returns(mappedColorUpdate);
      colorServiceStub.updateColor.rejects(new Error('UpdateColor error'));

      // Act
      const returnedColorResult: Promise<Color> = colorResolver.updateColor(updateColorInput);

      // Assert
      await expect(returnedColorResult).to.eventually.be.rejectedWith('UpdateColor error');
    });
  });
});
