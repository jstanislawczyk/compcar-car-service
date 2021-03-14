import {Field, ID} from 'type-graphql';
import {Column, PrimaryGeneratedColumn} from 'typeorm';

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
