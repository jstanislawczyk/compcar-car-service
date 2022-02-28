import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {TypeormLoader} from 'type-graphql-dataloader';
import {Generation} from './generation';
import {Brand} from './brand';

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

  @Field()
  @Column({
    length: 256,
  })
  public description: string;

  @Field(() => Brand)
  @ManyToOne(
    () => Brand,
    (brand: Brand) => brand.models,
  )
  @TypeormLoader()
  public brand?: Brand;

  @Field(() => [Generation])
  @OneToMany(
    () => Generation,
    (generation: Generation) => generation.model,
  )
  @TypeormLoader()
  public generations?: Generation[];
}
