import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Field, ID, ObjectType} from 'type-graphql';
import {TypeormLoader} from 'type-graphql-dataloader';
import {Painting} from './painting';

@Entity()
@ObjectType()
export class Color {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: number;

  @Field()
  @Column({
    length: 64,
  })
  public name: string;

  @Field()
  @Column({
    length: 8,
  })
  public hexCode: string;

  @Field(() => [Painting])
  @OneToMany(
    () => Painting,
    (painting: Painting) => painting.color,
  )
  @TypeormLoader()
  public paintings?: Painting[];
}
