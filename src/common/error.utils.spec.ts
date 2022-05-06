import {expect} from 'chai';
import {ErrorUtils} from './error.utils';

describe('ErrorUtils', () => {
  describe('sanitizeDuplicatedIndexErrorMessage', () => {
    it('should sanitize error message', () => {
      // Arrange
      const propertyName: string = 'red';
      const messageToSanitize: string = `Duplicate entry '${propertyName}' for key 'color.IDX_123'`;

      // Act
      const sanitizedMessage: string = ErrorUtils.sanitizeDuplicatedIndexErrorMessage(messageToSanitize);

      // Assert
      expect(sanitizedMessage).to.be.eql(`Value '${propertyName}' already exists`);
    });

    it('should return original message if massage has wrong format', () => {
      // Arrange
      const messageToSanitize: string = 'Duplicate entry';

      // Act
      const sanitizedMessage: string = ErrorUtils.sanitizeDuplicatedIndexErrorMessage(messageToSanitize);

      // Assert
      expect(sanitizedMessage).to.be.eql(messageToSanitize);
    });
  });
});
