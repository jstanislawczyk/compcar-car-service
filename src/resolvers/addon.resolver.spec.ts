import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {AddonService} from '../services/addon.service';
import {AddonMapper} from '../mapper/addon.mapper';
import {AddonResolver} from './addon.resolver';
import {AddonBuilder} from '../../test/utils/builders/addon.builder';
import {Addon} from '../models/entities/addon';
import {CreateAddonInput} from '../models/inputs/addon/create-addon.input';
import {UpdateAddonInput} from '../models/inputs/addon/update-addon.input';
import {AddonUpdate} from '../models/common/update/addon-update';

use(sinonChai);
use(chaiAsPromised);

context('AddonResolver', () => {

  let sandbox: SinonSandbox;
  let addonServiceStub: SinonStubbedInstance<AddonService>;
  let addonMapperStub: SinonStubbedInstance<AddonMapper>;
  let addonResolver: AddonResolver;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    addonServiceStub = sandbox.createStubInstance(AddonService);
    addonMapperStub = sandbox.createStubInstance(AddonMapper);

    addonResolver = new AddonResolver(addonServiceStub, addonMapperStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getAddons', () => {
    it('should return addons list', async () => {
      // Arrange
      const savedAddons: Addon[] = [
        new AddonBuilder().build(),
        new AddonBuilder(true)
          .withName('Air conditioner')
          .withDescription('Test description')
          .build(),
      ];

      addonServiceStub.findAll.resolves(savedAddons);

      // Act
      const addons: Addon[] = await addonResolver.getAddons();

      // Assert
      expect(addons).to.have.length(2);
      expect(addons).to.be.eql(savedAddons);
    });

    it('should throw error', async () => {
      // Arrange
      addonServiceStub.findAll.rejects(new Error('FindAll error'));

      // Act
      const findAllAddonsResult: Promise<Addon[]> = addonResolver.getAddons();

      // Assert
      await expect(findAllAddonsResult).to.eventually.be.rejectedWith('FindAll error');
    });
  });

  describe('createAddon', () => {
    it('should create addon', async () => {
      // Arrange
      const mappedAddon: Addon = new AddonBuilder().build();
      const savedAddon: Addon = new AddonBuilder(true).build();
      const createAddonInput: CreateAddonInput = {
        name: 'Air conditioner',
        description: 'Test description',
      };

      addonMapperStub.toEntity.returns(mappedAddon);
      addonServiceStub.saveAddon.resolves(savedAddon);

      // Act
      const returnedAddon: Addon = await addonResolver.createAddon(createAddonInput);

      // Assert
      expect(returnedAddon).to.be.eql(savedAddon);
      expect(addonMapperStub.toEntity).to.be.calledOnceWith(createAddonInput);
      expect(addonServiceStub.saveAddon).to.be.calledOnceWith(mappedAddon);
    });

    it('should throw error if addon saving fails', async () => {
      // Arrange
      const mappedAddon: Addon = new AddonBuilder().build();
      const createAddonInput: CreateAddonInput = {
        name: 'Air conditioner',
        description: 'Test description',
      };

      addonMapperStub.toEntity.returns(mappedAddon);
      addonServiceStub.saveAddon.rejects(new Error('SaveAddon error'));

      // Act
      const returnedAddonResult: Promise<Addon> = addonResolver.createAddon(createAddonInput);

      // Assert
      await expect(returnedAddonResult).to.eventually.be.rejectedWith('SaveAddon error');
    });
  });

  describe('updateAddon', () => {
    it('should update addon', async () => {
      // Arrange
      const name: string = 'NewAddon';
      const description: string = 'Test description';
      const mappedAddonUpdate: AddonUpdate = {
        id: 1,
        name,
        description,
      };
      const updatedAddon: Addon = new AddonBuilder(true)
          .withName('NewAddon')
          .build();
      const updateAddonInput: UpdateAddonInput = {
        id: mappedAddonUpdate.id,
        name: mappedAddonUpdate.name,
        description: mappedAddonUpdate.description,
      };

      addonMapperStub.toUpdateModel.returns(mappedAddonUpdate);
      addonServiceStub.updateAddon.resolves(updatedAddon);

      // Act
      const returnedAddon: Addon = await addonResolver.updateAddon(updateAddonInput);

      // Assert
      expect(returnedAddon).to.be.eql(updatedAddon);
      expect(addonMapperStub.toUpdateModel).to.be.calledOnceWith(updateAddonInput);
      expect(addonServiceStub.updateAddon).to.be.calledOnceWith(mappedAddonUpdate);
    });

    it('should throw error if addon updating fails', async () => {
      // Arrange
      const mappedAddonUpdate: AddonUpdate = {
        id: 1,
      };
      const updateAddonInput: UpdateAddonInput = {
        id: 1,
      };

      addonMapperStub.toUpdateModel.returns(mappedAddonUpdate);
      addonServiceStub.updateAddon.rejects(new Error('UpdateAddon error'));

      // Act
      const returnedAddonResult: Promise<Addon> = addonResolver.updateAddon(updateAddonInput);

      // Assert
      await expect(returnedAddonResult).to.eventually.be.rejectedWith('UpdateAddon error');
    });
  });
});
