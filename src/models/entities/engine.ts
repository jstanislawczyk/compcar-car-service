import {Field, Float, ID, ObjectType} from 'type-graphql';
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {FuelType} from '../enums/fuel-type';
import {Comment} from './comment';
import {TypeormLoader} from 'type-graphql-dataloader';
import {CarEngine} from './car-engine';

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
  public fuelCapacity: number;

  @Field(() => Float)
  @Column({
    type: 'double',
  })
  public averageFuelConsumption: number;

  @Field(() => Float)
  @Column({
    type: 'double',
  })
  public acceleration: number;

  @Field()
  @Column({
    type: 'enum',
    enum: FuelType,
  })
  public fuelType: FuelType;

  @Field()
  @Column({
    length: 4,
  })
  public inventedYear: string;

  @Field(() => [Comment])
  @OneToMany(
    () => Comment,
    (comment: Comment) => comment.engine,
  )
  @TypeormLoader()
  public comments?: Comment[];

  @Field(() => [CarEngine])
  @OneToMany(
    () => CarEngine,
    (carEngine: CarEngine) => carEngine.engine,
  )
  @TypeormLoader()
  public carEngines?: CarEngine[];
}
