import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Field, ID, ObjectType} from 'type-graphql';
import {TypeormLoader} from 'type-graphql-dataloader';
import { Brand } from './brand';

@Entity()
@ObjectType()
export class Country {

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
    length: 256,
  })
  public flagPhotoUrl: string;

  @Field(() => [Brand])
  @OneToMany(
    () => Brand,
    (brand: Brand) => brand.country,
  )
  @TypeormLoader()
  public brands?: Brand[];
}
