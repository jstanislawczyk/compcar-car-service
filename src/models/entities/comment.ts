import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import {ObjectType, Field, ID, Int} from 'type-graphql';
import {User} from './user';
import {TypeormLoader} from 'type-graphql-dataloader';
import {Engine} from './engine';
import {Generation} from './generation';

@Entity()
@ObjectType()
export class Comment {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: number;

  @Field()
  @Column({
    length: 512,
  })
  public text: string;

  @Field()
  @Column()
  public commentDate: string;

  @Field(() => Int)
  @Column()
  public rating: number;

  @Field(() => User)
  @ManyToOne(
    () => User,
    (user: User) => user.comments,
  )
  @TypeormLoader()
  public user?: User;

  @Field(() => Generation)
  @ManyToOne(
    () => Generation,
    (generation: Generation) => generation.comments,
  )
  @TypeormLoader()
  public generation?: Generation;

  @Field(() => Engine)
  @ManyToOne(
    () => Engine,
    (engine: Engine) => engine.comments,
  )
  @TypeormLoader()
  public engine?: Engine;
}
