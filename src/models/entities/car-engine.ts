import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {TypeormLoader} from 'type-graphql-dataloader';
import {Car} from './car';
import {Engine} from './engine';

@Entity()
@ObjectType()
export class CarEngine {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: number;

  @Field()
  @Column()
  public price: number;

  @Field(() => Car)
  @ManyToOne(
    () => Car,
    (car: Car) => car.carEngines,
  )
  @TypeormLoader()
  public car: Car;

  @Field(() => Engine)
  @ManyToOne(
    () => Engine,
    (engine: Engine) => engine.carEngines,
  )
  @TypeormLoader()
  public engine: Engine;
}
