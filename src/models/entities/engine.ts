import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {FuelType} from '../enums/fuel-type';

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
}
