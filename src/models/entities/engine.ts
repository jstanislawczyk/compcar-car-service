import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {FuelType} from '../enums/fuel-type';
import {Car} from './car';

@Entity()
@ObjectType()
export class Engine {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: number;

  @Field()
  @Column({
    length: 64,
  })
  public name: string;

  @Field()
  @Column()
  public horsePower: number;

  @Field()
  @Column()
  public capacity: number;

  @Field()
  @Column()
  public averageFuelConsumption: number;

  @Field()
  @Column()
  public acceleration: number;

  @Field()
  @Column({
    type: 'enum',
    enum: FuelType,
  })
  public fuelType: FuelType;

  @ManyToMany(() => Car, (car: Car) => car.engines)
  public cars: Car[];
}
