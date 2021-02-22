import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import {ObjectType, Field, ID, Int} from 'type-graphql';
import {User} from './user';

@Entity()
@ObjectType()
export class Comment {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: number;

  @Field()
  @Column()
  public text: string;

  @Field()
  @Column()
  public commentDate: Date;

  @Field(() => Int)
  @Column()
  public rating: number;

  @Field(() => User)
  @ManyToOne(
    () => User,
    (user: User) => user.comments,
  )
  public user?: Promise<User>;
}
