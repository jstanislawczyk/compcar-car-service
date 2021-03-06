import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {ObjectType, Field, ID} from 'type-graphql';
import {Comment} from './comment';
import {TypeormLoader} from 'type-graphql-dataloader';
import {UserRole} from '../../enums/user-role';

@Entity()
@ObjectType()
export class User {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: number;

  @Field()
  @Column({
    length: 320,
  })
  public email: string;

  @Field()
  @Column({
    length: 80,
  })
  public password: string;

  @Field()
  @Column({
    length: 20,
  })
  public role: UserRole;

  @Field()
  @Column()
  public registerDate: Date;

  @Field()
  @Column()
  public activated: boolean;

  @Field(() => [Comment])
  @OneToMany(
    () => Comment,
    (comment: Comment) => comment.user,
  )
  @TypeormLoader(
    () => Comment,
    (comment: Comment) => comment.userId,
    { selfKey: true },
  )
  public comments?: Comment[];
}
