import {Service} from 'typedi';
import {PaginationOptions} from '../models/common/filters/pagination-options';
import {PaginationInput} from '../models/inputs/pagination/pagination.input';

@Service()
export class PaginationMapper {

  public toPaginationOptions(paginationInput: PaginationInput): PaginationOptions {
    return {
      skip: (paginationInput.pageNumber - 1) * paginationInput.pageSize,
      take: paginationInput.pageSize,
    };
  }
}
