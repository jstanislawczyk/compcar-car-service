import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {TypeormLoader} from 'type-graphql-dataloader';
import {CarAddon} from './car-addon';

@Entity()
@ObjectType()
export class Addon {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: number;

  @Field()
  @Column({
    length: 128,
  })
  @Index({
    unique: true,
  })
  public name: string;

  @Field()
  @Column({
    length: 256,
  })
  public description?: string;

  @Field(() => [CarAddon])
  @OneToMany(
    () => CarAddon,
    (carAddon: CarAddon) => carAddon.addon,
  )
  @TypeormLoader()
  public carAddons?: CarAddon[];
}
