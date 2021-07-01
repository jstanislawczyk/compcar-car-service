import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {Color} from '../enums/color';

@Entity()
@ObjectType()
export class Painting {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id?: number;

  @Field()
  @Column({
    type: 'enum',
    enum: Color,
  })
  public color: Color;

  @Field()
  @Column()
  public price?: number;
}
