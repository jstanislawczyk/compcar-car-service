import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Field, ID, ObjectType} from 'type-graphql';
import {User} from './user';

@Entity()
@ObjectType()
export class RegistrationConfirmation {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public code: string;

  @Field()
  @Column()
  public allowedConfirmationDate: string;

  @Field({
    nullable: true,
  })
  @Column({
    nullable: true,
  })
  public confirmedAt?: string;

  @OneToOne(
    () => User,
    (user: User) => user.registrationConfirmation,
  )
  @JoinColumn()
  @JoinColumn()
  public user: User;
}
