import {Field, ID, ObjectType} from 'type-graphql';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

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
}
