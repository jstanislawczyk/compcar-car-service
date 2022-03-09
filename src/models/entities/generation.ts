import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {TypeormLoader} from 'type-graphql-dataloader';
import {Model} from './model';
import {Car} from './car';
import {Comment} from './comment';

@Entity()
@ObjectType()
export class Generation {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: number;

  @Field()
  @Column({
    length: 32,
  })
  public name: string;

  @Field()
  @Column({
    length: 256,
  })
  public description: string;

  @Field()
  @Column()
  public startYear: string;

  @Field()
  @Column()
  public endYear?: string;

  @Field(() => Model)
  @ManyToOne(
    () => Model,
    (model: Model) => model.generations,
  )
  @TypeormLoader()
  public model?: Model;

  @Field(() => [Car])
  @OneToMany(
    () => Car,
    (car: Car) => car.generation,
  )
  @TypeormLoader()
  public cars?: Car[];

  @Field(() => [Comment])
  @OneToMany(
    () => Comment,
    (comment: Comment) => comment.generation,
  )
  @TypeormLoader()
  public comments?: Comment[];
}
