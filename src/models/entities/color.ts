import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
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
  @Index({
    unique: true,
  })
  public name: string;

  @Field()
  @Column({
    length: 8,
  })
  @Index({
    unique: true,
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
