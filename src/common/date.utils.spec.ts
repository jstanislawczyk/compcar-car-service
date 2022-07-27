import {expect} from 'chai';
import {DateUtils} from './date.utils';

describe('DateUtils', () => {

  describe('addMillisToISODate', () => {
    it('should add milliseconds to given date', () => {
      // Arrange
      const oldISODate: string = '2022-07-27T18:00:00.000Z';
      const milliseconds: number = 50_000; // 50 seconds

      // Act
      const newDate: string = DateUtils.addMillisToISODate(oldISODate, milliseconds);

      // Assert
      expect(newDate).to.be.eql('2022-07-27T18:00:50.000Z');
    });
  });

  describe('formatISODateToReadableFormat', () => {
    it('should format date', () => {
      // Arrange
      const date: string = '2022-07-27T18:00:00.000Z';

      // Act
      const formattedDate: string = DateUtils.formatISODateToReadableFormat(date);

      // Assert
      expect(formattedDate).to.be.eql('Wednesday, 27 July 2022 at 20:00:00 CEST');
    });
  });
});
