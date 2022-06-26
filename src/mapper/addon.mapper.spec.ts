import {expect} from 'chai';
import {AddonMapper} from './addon.mapper';
import {CreateAddonInput} from '../models/inputs/addon/create-addon.input';
import {Addon} from '../models/entities/addon';
import {UpdateAddonInput} from '../models/inputs/addon/update-addon.input';
import {AddonUpdate} from '../models/common/update/addon.update';

context('AddonMapper', () => {

  let addonMapper: AddonMapper;

  beforeEach(() => {
    addonMapper = new AddonMapper();
  });

  describe('toEntity', () => {
    it('should map to entity', () => {
      // Arrange
      const createAddonInput: CreateAddonInput = {
        name: 'Air conditioner',
        description: 'Test air conditioner',
      };

      // Act
      const addon: Addon = addonMapper.toEntity(createAddonInput);

      // Assert
      expect(addon.name).to.be.eql(createAddonInput.name);
      expect(addon.description).to.be.eql(createAddonInput.description);
      expect(addon.id).to.be.undefined;
      expect(addon.carAddons).to.be.undefined;
    });
  });

  describe('toUpdateEntity', () => {
    it('should map to model with required properties only', () => {
      // Arrange
      const updateAddonInput: UpdateAddonInput = {
        id: 1,
      };

      // Act
      const addonUpdate: AddonUpdate = addonMapper.toUpdateModel(updateAddonInput);

      // Assert
      expect(addonUpdate.id).to.be.eql(updateAddonInput.id);
      expect(addonUpdate.name).to.be.undefined;
      expect(addonUpdate.description).to.be.undefined;
    });

    it('should map to model with all properties', () => {
      // Arrange
      const updateAddonInput: UpdateAddonInput = {
        id: 1,
        name: 'Air conditioner',
        description: 'Test air conditioner',
      };

      // Act
      const addonUpdate: AddonUpdate = addonMapper.toUpdateModel(updateAddonInput);

      // Assert
      expect(addonUpdate.id).to.be.eql(updateAddonInput.id);
      expect(addonUpdate.name).to.be.eql(updateAddonInput.name);
      expect(addonUpdate.description).to.be.eql(updateAddonInput.description);
    });
  });
});
