import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {AddonRepository} from '../repositories/addon.repository';
import {AddonService} from './addon.service';
import {Addon} from '../models/entities/addon';
import {AddonBuilder} from '../../test/utils/builders/addon.builder';
import {NotFoundError} from '../models/errors/not-found.error';
import {AddonUpdate} from '../models/common/update/addon-update';
import {DuplicateEntryError} from '../models/errors/duplicate-entry.error';

use(sinonChai);
use(chaiAsPromised);

context('AddonService', () => {

  let sandbox: SinonSandbox;
  let addonRepositoryStub: SinonStubbedInstance<AddonRepository>;
  let addonService: AddonService;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    addonRepositoryStub = sandbox.createStubInstance(AddonRepository);
    addonService = new AddonService(addonRepositoryStub);

    addonRepositoryStub.find.resolves([]);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findAll', () => {
    it('should get addons list', async () => {
      // Arrange
      const addonsList: Addon[] = [
        new AddonBuilder(true).build(),
        new AddonBuilder(true)
          .withName('Air conditioner')
          .withDescription('Test description')
          .build(),
      ];

      addonRepositoryStub.find.resolves(addonsList);

      // Act
      const addonsResult: Addon[] = await addonService.findAll();

      // Assert
      expect(addonsResult).to.be.have.length(2);
      expect(addonsResult[0]).to.be.eql(addonsList[0]);
      expect(addonsResult[1]).to.be.eql(addonsList[1]);
      expect(addonRepositoryStub.find).to.be.calledOnce;
    });

    it('should throw error', async () => {
      // Arrange
      addonRepositoryStub.find.rejects(new Error('Find error'));

      // Act
      const addonsResult: Promise<Addon[]> = addonService.findAll();

      // Assert
      await expect(addonsResult).to.eventually.be.rejectedWith('Find error');
    });
  });

  describe('saveAddon', () => {
    it('should save addon', async () => {
      // Arrange
      const description: string = 'hexCode';
      const addonToSave: Addon = new AddonBuilder()
          .withDescription(description)
          .build();
      const savedAddon: Addon = new AddonBuilder()
          .withId(1)
          .build();

      addonRepositoryStub.save.resolves(savedAddon);

      // Act
      const saveAddonResult: Addon = await addonService.saveAddon(addonToSave);

      // Assert
      expect(saveAddonResult).to.be.eql(savedAddon);
      expect(addonRepositoryStub.save).to.be.calledOnceWith({
        name: addonToSave.name,
        description: addonToSave.description,
      });
    });

    describe('should throw error', () => {
      it('duplicated entry error', async () => {
        // Arrange
        const errorMessage: string = `Duplicate entry 'air conditioner' for key 'addon.IDX_123'`;

        addonRepositoryStub.save.rejects({
          code: 'ER_DUP_ENTRY',
          message: errorMessage,
        });

        // Act
        const saveAddonResult: Promise<Addon> = addonService.saveAddon(new AddonBuilder().build());

        // Assert
        await expect(saveAddonResult).to.eventually.be
          .rejectedWith("Value 'air conditioner' already exists")
          .and.be.an.instanceOf(DuplicateEntryError);
      });

      it('coming from repository', async () => {
        // Arrange
        addonRepositoryStub.save.rejects(new Error('Save error'));

        // Act
        const saveAddonResult: Promise<Addon> = addonService.saveAddon(new AddonBuilder().build());

        // Assert
        await expect(saveAddonResult).to.eventually.be
            .rejectedWith('Save error')
            .and.be.an.instanceOf(Error);
      });
    });
  });

  describe('updateAddon', () => {
    describe('should update addon', () => {
      it('with all properties', async () => {
        // Arrange
        const id: number = 1;
        const newName: string = 'NewName';
        const newDescription: string = 'Test description';
        const addonUpdate: AddonUpdate = {
          id,
          name: newName,
          description: newDescription,
        };
        const existingAddon: Addon = new AddonBuilder()
            .withId(id)
            .withName('OldName')
            .withDescription('Another test description')
            .build();
        const updatedAddon: Addon = new AddonBuilder()
            .withId(id)
            .withName(newName)
            .withDescription(newDescription)
            .build();

        addonRepositoryStub.findOne.resolves(existingAddon);
        addonRepositoryStub.save.resolves(updatedAddon);

        // Act
        const returnedAddon: Addon = await addonService.updateAddon(addonUpdate);

        // Assert
        expect(returnedAddon).to.be.eql(updatedAddon);
        expect(addonRepositoryStub.findOne).to.be.calledOnceWith(addonUpdate.id);
        expect(addonRepositoryStub.save).to.be.calledOnceWith({
          id: existingAddon.id,
          name: newName,
          description: newDescription,
        });
      });

      it('with single optional property', async () => {
        // Arrange
        const id: number = 1;
        const newName: string = 'NewName';
        const addonUpdate: AddonUpdate = {
          id,
          name: newName,
        };
        const existingAddon: Addon = new AddonBuilder()
            .withId(id)
            .withName('OldName')
            .withDescription('Test description')
            .build();
        const updatedAddon: Addon = new AddonBuilder()
            .withId(id)
            .withName(newName)
            .withDescription(existingAddon.description)
            .build();

        addonRepositoryStub.findOne.resolves(existingAddon);
        addonRepositoryStub.save.resolves(updatedAddon);

        // Act
        const returnedAddon: Addon = await addonService.updateAddon(addonUpdate);

        // Assert
        expect(returnedAddon).to.be.eql(updatedAddon);
        expect(addonRepositoryStub.findOne).to.be.calledOnceWith(addonUpdate.id);
        expect(addonRepositoryStub.save).to.be.calledOnceWith({
          id: existingAddon.id,
          name: newName,
          description: existingAddon.description,
        });
      });

      it('with required properties only', async () => {
        // Arrange
        const id: number = 1;
        const addonUpdate: AddonUpdate = {
          id,
        };
        const existingAddon: Addon = new AddonBuilder()
            .withId(id)
            .withName('AddonName')
            .withDescription('Test description')
            .build();
        const updatedAddon: Addon = new AddonBuilder()
            .withId(id)
            .build();

        addonRepositoryStub.findOne.resolves(existingAddon);
        addonRepositoryStub.save.resolves(updatedAddon);

        // Act
        const returnedAddon: Addon = await addonService.updateAddon(addonUpdate);

        // Assert
        expect(returnedAddon).to.be.eql(updatedAddon);
        expect(addonRepositoryStub.findOne).to.be.calledOnceWith(addonUpdate.id);
        expect(addonRepositoryStub.save).to.be.calledOnceWith({
          id: existingAddon.id,
          name: existingAddon.name,
          description: existingAddon.description,
        });
      });
    });

    describe('should throw error', () => {
      it("if addon doesn't exist", async () => {
        // Arrange
        const addonUpdate: AddonUpdate = {
          id: 1,
        };

        addonRepositoryStub.findOne.resolves(undefined);

        // Act
        const updateAddonResult: Promise<Addon> = addonService.updateAddon(addonUpdate);

        // Assert
        await expect(updateAddonResult).to.eventually.be
            .rejectedWith(`Addon with id=${addonUpdate.id} not found`)
            .and.be.an.instanceOf(NotFoundError);
      });

      it('duplicated entry error', async () => {
        // Arrange
        const errorMessage: string = `Duplicate entry 'Air conditioner' for key 'addon.IDX_123'`;
        const addonUpdate: AddonUpdate = {
          id: 1,
        };

        addonRepositoryStub.findOne.resolves(new AddonBuilder().build());
        addonRepositoryStub.save.rejects({
          code: 'ER_DUP_ENTRY',
          message: errorMessage,
        });

        // Act
        const updateAddonResult: Promise<Addon> = addonService.updateAddon(addonUpdate);

        // Assert
        await expect(updateAddonResult).to.eventually.be
          .rejectedWith("Value 'Air conditioner' already exists")
          .and.be.an.instanceOf(DuplicateEntryError);
      });

      it('coming from AddonRepository save method', async () => {
        // Arrange
        const addonUpdate: AddonUpdate = {
          id: 1,
        };

        addonRepositoryStub.findOne.resolves(new AddonBuilder().build());
        addonRepositoryStub.save.rejects(new Error('Save error'));

        // Act
        const updateAddonResult: Promise<Addon> = addonService.updateAddon(addonUpdate);

        // Assert
        await expect(updateAddonResult).to.eventually.be
            .rejectedWith('Save error')
            .and.be.an.instanceOf(Error);
      });
    });
  });
});
