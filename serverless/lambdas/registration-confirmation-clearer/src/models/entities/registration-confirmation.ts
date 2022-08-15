import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class RegistrationConfirmation {

  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public allowedConfirmationDate: string;
}
