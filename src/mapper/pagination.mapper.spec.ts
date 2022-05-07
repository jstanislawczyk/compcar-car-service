import {expect} from 'chai';
import {PaginationMapper} from './pagination.mapper';
import {PaginationInput} from '../models/inputs/pagination/pagination.input';
import {PaginationOptions} from '../models/common/filters/pagination-options';

context('PaginationMapper', () => {

  let paginationMapper: PaginationMapper;

  beforeEach(() => {
    paginationMapper = new PaginationMapper();
  });

  describe('toPaginationOptions', () => {
    describe('should map to pagination options', () => {
      it('for first page', () => {
        // Arrange
        const paginationInput: PaginationInput = {
          pageSize: 15,
          pageNumber: 1,
        };

        // Act
        const paginationOptions: PaginationOptions = paginationMapper.toPaginationOptions(paginationInput);

        // Assert
        expect(paginationOptions.skip).to.be.eql(0);
        expect(paginationOptions.take).to.be.eql(15);
      });

      it('for second page', () => {
        // Arrange
        const paginationInput: PaginationInput = {
          pageSize: 20,
          pageNumber: 2,
        };

        // Act
        const paginationOptions: PaginationOptions = paginationMapper.toPaginationOptions(paginationInput);

        // Assert
        expect(paginationOptions.skip).to.be.eql(20);
        expect(paginationOptions.take).to.be.eql(20);
      });
    });
  });
});
