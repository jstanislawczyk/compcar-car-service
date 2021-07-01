import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {TypeormLoader} from 'type-graphql-dataloader';
import {Generation} from './generation';
import {Photo} from './photo';
import {CarAddon} from './car-addon';
import {Engine} from './engine';

@Entity()
@ObjectType()
export class Car {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: number;

  @Field()
  @Column({
    length: 32,
  })
  public name: string;

  @Field(() => Generation)
  @ManyToOne(
    () => Generation,
    (generation: Generation) => generation.cars,
  )
  @TypeormLoader()
  public generation: Generation;

  @Field(() => [Photo])
  @OneToMany(
    () => Photo,
    (photo: Photo) => photo.car,
  )
  @TypeormLoader()
  public photos?: Photo[];

  @Field(() => [CarAddon])
  @OneToMany(
    () => CarAddon,
    (carAddon: CarAddon) => carAddon.car,
  )
  @TypeormLoader()
  public carAddons?: CarAddon[];

  @ManyToMany(() => Engine, (engine: Engine) => engine.cars)
  @JoinTable()
  public engines: Engine[];
}
