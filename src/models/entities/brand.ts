import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {Country} from '../enums/country';

@Entity()
@ObjectType()
export class Brand {

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
    type: 'enum',
    enum: Country,
  })
  public country: Country;
}
