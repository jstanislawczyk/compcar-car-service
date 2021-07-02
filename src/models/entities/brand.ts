import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {TypeormLoader} from 'type-graphql-dataloader';
import {Country} from './country';
import {Model} from './model';

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

  @Field(() => [Model])
  @OneToMany(
    () => Model,
    (model: Model) => model.brand,
  )
  @TypeormLoader()
  public models?: Model[];
}
