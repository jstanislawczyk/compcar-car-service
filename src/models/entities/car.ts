import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {TypeormLoader} from 'type-graphql-dataloader';
import {Generation} from './generation';
import {Photo} from './photo';
import {CarAddon} from './car-addon';
import {Painting} from './painting';
import {BodyStyle} from '../enums/body-style';
import {CarEngine} from './car-engine';

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
  public startYear: number;

  @Field({
    nullable: true,
  })
  @Column({
    nullable: true,
  })
  public endYear?: number;

  @Field()
  @Column()
  public weight: number;

  @Field()
  @Column({
    type: 'enum',
    enum: BodyStyle,
  })
  public bodyStyle: BodyStyle;

  @Field(() => Generation)
  @ManyToOne(
    () => Generation,
    (generation: Generation) => generation.cars,
  )
  @TypeormLoader()
  public generation?: Generation;

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

  @Field(() => [CarEngine])
  @OneToMany(
    () => CarEngine,
    (carEngine: CarEngine) => carEngine.car,
  )
  @TypeormLoader()
  public carEngines?: CarEngine[];

  @Field(() => [Painting])
  @OneToMany(
    () => Painting,
    (painting: Painting) => painting.car,
  )
  @TypeormLoader()
  public paintings?: Painting[];
}
