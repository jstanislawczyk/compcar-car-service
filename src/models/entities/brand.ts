import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {TypeormLoader} from 'type-graphql-dataloader';
import {Country} from './country';
import {Car} from './car';

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
    length: 512,
  })
  public logoPhotoUrl: string;

  @Field(() => Country)
  @ManyToOne(
    () => Country,
    (country: Country) => country.brands,
  )
  @TypeormLoader()
  public country?: Country;

  @Field(() => [Car])
  @OneToMany(
    () => Car,
    (car: Car) => car.brand,
  )
  @TypeormLoader()
  public models?: Car[];
}
