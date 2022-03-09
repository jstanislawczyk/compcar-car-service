import {Generation} from '../../../src/models/entities/generation';
import {fullGeneration, generation} from '../../fixtures/generation.fixture';

export class GenerationFixtureProvider {

  public static getValidGeneration(populateOptionalFields: boolean = false): Generation {
    const validGeneration: Generation = populateOptionalFields ? fullGeneration : generation;

    return Object.assign({}, validGeneration);
  }
}
