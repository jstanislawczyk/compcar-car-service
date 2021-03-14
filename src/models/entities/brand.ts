import {Field, ID} from 'type-graphql';
import {Column, PrimaryGeneratedColumn} from 'typeorm';
import {Country} from '../enums/country';

export class Car {

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
    length: 64,
  })
  public country: Country;
}
