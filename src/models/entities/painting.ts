import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Color} from './color';
import {TypeormLoader} from 'type-graphql-dataloader';
import {Car} from './car';

@Entity()
@ObjectType()
export class Painting {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: number;

  @Field()
  @Column()
  public price?: number;

  @Field(() => Color)
  @ManyToOne(
    () => Color,
    (color: Color) => color.paintings,
  )
  @TypeormLoader()
  public color: Color;

  @Field(() => [Car])
  @OneToMany(
    () => Car,
    (car: Car) => car.painting,
  )
  @TypeormLoader()
  public cars?: Car[];
}
