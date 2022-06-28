import {ValidationError} from 'class-validator';

export class TestValidationError extends ValidationError {
  constraints: {
    [constraint: string]: string;
  };
}
