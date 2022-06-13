import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {PhotoRepository} from '../repositories/photo.repository';
import {Photo} from '../models/entities/photo';
import {NotFoundError} from '../models/errors/not-found.error';

@Service()
export class PhotoService {

  constructor(
    @InjectRepository()
    private readonly photoRepository: PhotoRepository,
  ) {
  }

  public async findRelatedPhotosByIds(photoIds: number[]): Promise<Photo[]> {
    const photos: Photo[] = await this.photoRepository.findByIds(photoIds);
    const notFoundPhotosIds: number[] = photos
      .map((photo: Photo) => photo.id as number)
      .filter((photoId: number) => photoIds.indexOf(photoId) < 0);

    if (notFoundPhotosIds.length > 0) {
      const formattedIds: string = notFoundPhotosIds.join(', ');
      throw new NotFoundError(`Photos with ids=[${formattedIds}] not found`);
    }

    return photos;
  }

}
