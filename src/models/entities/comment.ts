import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId} from 'typeorm';
import {ObjectType, Field, ID, Int} from 'type-graphql';
import {User} from './user';
import {TypeormLoader} from 'type-graphql-dataloader';

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
  @TypeormLoader(
    () => User,
    (comment: Comment) => comment.userId,
  )
  public user?: User;

  @RelationId((comment: Comment) => comment.user)
  public userId?: number;
}
