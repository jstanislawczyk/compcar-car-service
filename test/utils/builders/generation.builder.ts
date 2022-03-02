import {Builder} from './builder';
import {Generation} from '../../../src/models/entities/generation';
import {GenerationFixtureProvider} from '../fixture-providers/generation.fixture-provider';

export class GenerationBuilder extends Builder<Generation> {

  constructor(populateOptionalFields: boolean = false) {
    const generation: Generation = GenerationFixtureProvider.getValidGeneration(populateOptionalFields);

    super(generation);
  }

  public withId(id: number): GenerationBuilder {
    this.entity.id = id;
    return this;
  }

  public withName(name: string): GenerationBuilder {
    this.entity.name = name;
    return this;
  }

  public withStartYear(startYear: string): GenerationBuilder {
    this.entity.startYear = startYear;
    return this;
  }

  public withEndYear(endYear: string): GenerationBuilder {
    this.entity.endYear = endYear;
    return this;
  }
}
