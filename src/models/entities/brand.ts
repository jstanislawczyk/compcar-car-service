import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {TypeormLoader} from 'type-graphql-dataloader';
import {Country} from './country';

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

  @Field(() => Country)
  @ManyToOne(
    () => Country,
    (country: Country) => country.brands,
  )
  @TypeormLoader()
  public country: Country;
}
