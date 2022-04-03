import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {TypeormLoader} from 'type-graphql-dataloader';
import {Generation} from './generation';
import {Photo} from './photo';
import {CarAddon} from './car-addon';
import {Engine} from './engine';
import {Painting} from './painting';
import {BodyStyle} from '../enums/body-style';

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

  @Field()
  @Column({
    length: 256,
  })
  public description: string;

  @Field()
  @Column()
  public basePrice: number;

  @Field()
  @Column()
  public startYear: string;

  @Field()
  @Column()
  public endYear?: string;

  @Field()
  @Column()
  public weight: number;

  @Field()
  @Column({
    type: 'enum',
    enum: BodyStyle,
  })
  public bodyStyle: BodyStyle;

  @Field()
  @Column()
  public isAvailable: boolean;

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

  @Field(() => [Painting])
  @OneToMany(
    () => Painting,
    (painting: Painting) => painting.car,
  )
  @TypeormLoader()
  public paintings: Painting[];

  @ManyToMany(
    () => Engine,
    (engine: Engine) => engine.cars)
  @JoinTable()
  public engines?: Engine[];
}
