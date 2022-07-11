import {ValidationError} from 'class-validator';

export class TestValidationError extends ValidationError {

  public constraints: {
    [constraint: string]: string;
  };
}
