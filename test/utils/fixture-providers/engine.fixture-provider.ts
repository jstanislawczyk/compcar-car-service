import {Engine} from '../../../src/models/entities/engine';
import {fullEngine, engine} from '../../fixtures/engine.fixture';

export class EngineFixtureProvider {

  public static getValidEngine(populateOptionalFields: boolean = false): Engine {
    const validEngine: Engine = populateOptionalFields ? fullEngine : engine;

    return Object.assign({}, validEngine);
  }
}
