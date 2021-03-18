import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
@ObjectType()
export class Car {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: number;

  @Field()
  @Column({
    length: 128,
  })
  public name: string;
}
