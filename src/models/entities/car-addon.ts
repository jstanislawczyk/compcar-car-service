import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {TypeormLoader} from 'type-graphql-dataloader';
import {Car} from './car';
import {Addon} from './addon';

@Entity()
@ObjectType()
export class CarAddon {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: number;

  @Field()
  @Column()
  public price: number;

  @Field(() => Car)
  @ManyToOne(
    () => Car,
    (car: Car) => car.carAddons,
  )
  @TypeormLoader()
  public car: Car;

  @Field(() => Addon)
  @ManyToOne(
    () => Addon,
    (addon: Addon) => addon.carAddons,
  )
  @TypeormLoader()
  public addon: Addon;
}
