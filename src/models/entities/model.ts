import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
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

  @Field(() => [Generation])
  @OneToMany(
    () => Generation,
    (generation: Generation) => generation.model,
  )
  @TypeormLoader()
  public generations?: Generation[];
}
