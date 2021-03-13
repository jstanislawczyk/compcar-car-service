import {TestValidationError} from './validation-error';

export class ResponseError {
  message: string;
  extensions: {
    code: string;
    exception: {
      validationErrors: TestValidationError[];
    };
  };
}
