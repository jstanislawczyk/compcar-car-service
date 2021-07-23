import {UserDatabaseUtils} from './user.database-utils';
import {CommentDatabaseUtils} from './comment.database-utils';
import {ColorDatabaseUtils} from './color.database-utils';
import {CountryDatabaseUtils} from './country.database-utils';
import {BrandDatabaseUtils} from './brand.database-utils';
import {PaintingDatabaseUtils} from './painting.database-utils';

export class CommonDatabaseUtils {

  public static async deleteAllEntities(): Promise<void> {
    await CommentDatabaseUtils.deleteAllComments();
    await UserDatabaseUtils.deleteAllUsers();
    await PaintingDatabaseUtils.deleteAllPaintings();
    await ColorDatabaseUtils.deleteAllColors();
    await BrandDatabaseUtils.deleteAllBrands();
    await CountryDatabaseUtils.deleteAllCountries();
  }
}
