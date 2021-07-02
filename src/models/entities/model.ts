import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Brand} from './brand';
import {TypeormLoader} from 'type-graphql-dataloader';
import {Generation} from './generation';

@Entity()
@ObjectType()
export class Model {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: number;

  @Field()
  @Column({
    length: 128,
  })
  public name: string;

  @Field(() => Brand)
  @ManyToOne(
    () => Brand,
    (brand: Brand) => brand.models,
  )
  @TypeormLoader()
  public brand: Brand;

  @Field(() => [Generation])
  @OneToMany(
    () => Generation,
    (generation: Generation) => generation.model,
  )
  @TypeormLoader()
  public generations?: Generation[];
}
