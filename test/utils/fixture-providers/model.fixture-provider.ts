import {Model} from '../../../src/models/entities/model';
import {fullModel, model} from '../../fixtures/model.fixture';

export class ModelFixtureProvider {

  public static getValidModel(populateOptionalFields: boolean = false): Model {
    const validModel: Model = populateOptionalFields ? fullModel : model;

    return Object.assign({}, validModel);
  }
}
