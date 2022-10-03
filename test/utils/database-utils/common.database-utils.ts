import {UserDatabaseUtils} from './user.database-utils';
import {CommentDatabaseUtils} from './comment.database-utils';
import {ColorDatabaseUtils} from './color.database-utils';
import {CountryDatabaseUtils} from './country.database-utils';
import {BrandDatabaseUtils} from './brand.database-utils';
import {ModelDatabaseUtils} from './model.database-utils';
import {GenerationDatabaseUtils} from './generation.database-utils';
import {CarDatabaseUtils} from './car.database-utils';
import {RegistrationConfirmationDatabaseUtils} from './registration-confirmation.database-utils';

export class CommonDatabaseUtils {

  public static async deleteAllEntities(): Promise<void> {
    await CarDatabaseUtils.deleteAllCars();
    await GenerationDatabaseUtils.deleteAllGenerations();
    await ModelDatabaseUtils.deleteAllModels();
    await CommentDatabaseUtils.deleteAllComments();
    await RegistrationConfirmationDatabaseUtils.deleteAllRegistrationConfirmations();
    await UserDatabaseUtils.deleteAllUsers();
    await ColorDatabaseUtils.deleteAllColors();
    await BrandDatabaseUtils.deleteAllBrands();
    await CountryDatabaseUtils.deleteAllCountries();
  }
}
