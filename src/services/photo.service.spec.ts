import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {PhotoRepository} from '../repositories/photo.repository';
import {PhotoService} from './photo.service';
import {Photo} from '../models/entities/photo';
import {fullPhoto} from '../../test/fixtures/photo.fixture';

use(sinonChai);
use(chaiAsPromised);

context('CarService', () => {

  let sandbox: SinonSandbox;
  let photoRepositoryStub: SinonStubbedInstance<PhotoRepository>;
  let photoService: PhotoService;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    photoRepositoryStub = sandbox.createStubInstance(PhotoRepository);
    photoService = new PhotoService(photoRepositoryStub);

    photoRepositoryStub.findOne.resolves();
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('findRelatedPhotosByIds', () => {
    it('should find related photos', async () => {
      // Arrange
      const firstPhoto: Photo = {
        ...fullPhoto,
        id: 1,
      };
      const secondPhoto: Photo = {
        ...fullPhoto,
        id: 2,
      };
      const photoIds: number[] = [
        Number(firstPhoto.id),
        Number(secondPhoto.id),
      ];

      photoRepositoryStub.findByIds.resolves([
        firstPhoto, secondPhoto,
      ]);

      // Act
      const photos: Photo[] = await photoService.findRelatedPhotosByIds(photoIds);

      // Assert
      expect(photos).to.be.an('array').length(2);
      expect(photos[0]).to.be.eql(firstPhoto);
      expect(photos[1]).to.be.eql(secondPhoto);
    });
  });
});
