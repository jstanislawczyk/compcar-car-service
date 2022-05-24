import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {TypeormLoader} from 'type-graphql-dataloader';
import {Car} from './car';

@Entity()
@ObjectType()
export class Photo {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: number;

  @Field()
  @Column({
    length: 512,
  })
  public url: string;

  @Field()
  @Column({
    length: 256,
  })
  public description?: string;

  @Field(() => Car)
  @ManyToOne(
    () => Car,
    (car: Car) => car.photos,
  )
  @TypeormLoader()
  public car?: Car;
}
