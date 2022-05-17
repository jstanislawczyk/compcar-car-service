import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {NotFoundError} from '../models/errors/not-found.error';
import {PhotoRepository} from '../repositories/photo.repository';
import {PhotoService} from './photo.service';

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

  afterEach(() => {
    sandbox.restore();
  });


  describe('findRelatedPhotosByIds', () => {

  });
});
