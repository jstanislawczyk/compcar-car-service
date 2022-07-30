import {getRepository, MoreThan, Repository} from 'typeorm';
import {Photo} from '../../../src/models/entities/photo';
import {FindOneOptions} from 'typeorm/find-options/FindOneOptions';

export class PhotoDatabaseUtils {

  public static getAllPhotos(): Promise<Photo[]> {
    return this.getPhotoRepository().find();
  }

  public static getPhotoById(id: number, options: FindOneOptions<Photo> = {}): Promise<Photo | undefined> {
    return this.getPhotoRepository().findOne({ id }, options);
  }

  public static getPhotoByIdOrFail(id: number, options: FindOneOptions<Photo> = {}): Promise<Photo> {
    return this.getPhotoRepository().findOneOrFail({ id }, options);
  }

  public static savePhoto(photo: Photo): Promise<Photo> {
    return this.getPhotoRepository().save(photo);
  }

  public static savePhotosList(photos: Photo[]): Promise<Photo[]> {
    return this.getPhotoRepository().save(photos);
  }

  public static async deleteAllPhotos(): Promise<void> {
    const numberOfPhotos: number = await this.countPhotos();

    if (numberOfPhotos > 0) {
      await this.getPhotoRepository().delete({
        id: MoreThan(0),
      });
    }
  }

  public static async countPhotos(): Promise<number> {
    return this.getPhotoRepository().count();
  }

  private static getPhotoRepository(): Repository<Photo> {
    return getRepository(Photo);
  }
}
