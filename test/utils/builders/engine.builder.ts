import {Builder} from './builder';
import {Engine} from '../../../src/models/entities/engine';
import {EngineFixtureProvider} from '../fixture-providers/engine.fixture-provider';
import {FuelType} from '../../../src/models/enums/fuel-type';

export class EngineBuilder extends Builder<Engine> {

  constructor(populateOptionalFields: boolean = false) {
    const engine: Engine = EngineFixtureProvider.getValidEngine(populateOptionalFields);

    super(engine);
  }

  public withId(id: number): EngineBuilder {
    this.entity.id = id;
    return this;
  }

  public withName(name: string): EngineBuilder {
    this.entity.name = name;
    return this;
  }

  public withHorsePower(horsePower: number): EngineBuilder {
    this.entity.horsePower = horsePower;
    return this;
  }

  public withAcceleration(acceleration: number): EngineBuilder {
    this.entity.acceleration = acceleration;
    return this;
  }

  public withAverageFuelConsumption(averageFuelConsumption: number): EngineBuilder {
    this.entity.averageFuelConsumption = averageFuelConsumption;
    return this;
  }

  public withFuelCapacity(fuelCapacity: number): EngineBuilder {
    this.entity.fuelCapacity = fuelCapacity;
    return this;
  }

  public withInventedYear(inventedYear: string): EngineBuilder {
    this.entity.inventedYear = inventedYear;
    return this;
  }

  public withFuelType(fuelType: FuelType): EngineBuilder {
    this.entity.fuelType = fuelType;
    return this;
  }
}
