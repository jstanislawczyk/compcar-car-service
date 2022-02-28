import {Builder} from './builder';
import {Model} from '../../../src/models/entities/model';
import {ModelFixtureProvider} from '../fixture-providers/model.fixture-provider';

export class ModelBuilder extends Builder<Model> {

  constructor(populateOptionalFields: boolean = false) {
    const model: Model = ModelFixtureProvider.getValidModel(populateOptionalFields);

    super(model);
  }

  public withId(id: number): ModelBuilder {
    this.entity.id = id;
    return this;
  }

  public withName(name: string): ModelBuilder {
    this.entity.name = name;
    return this;
  }

  public withDescription(description: string): ModelBuilder {
    this.entity.description = description;
    return this;
  }
}
