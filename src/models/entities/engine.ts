import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {FuelType} from '../enums/fuel-type';
import {Car} from './car';
import {Comment} from './comment';
import {TypeormLoader} from 'type-graphql-dataloader';

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

  @ManyToMany(() => Car, (car: Car) => car.engines)
  public cars?: Car[];
}
