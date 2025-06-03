import { PgSelect } from 'drizzle-orm/pg-core';
import { TPagination, TPaginationMetadata } from 'src/types/Pagination';

export interface IPaginationService {
  withPagination<T extends PgSelect>(qb: T, params: TPagination): T;
  calculatePaginationMeta(data: TPagination & { total: number }): TPaginationMetadata;
}

export function getPaginationService(): IPaginationService {
  return {
    withPagination<T extends PgSelect>(qb: T, params: TPagination) {
      const offset = Number(params.offset);
      const limit = Number(params.limit);
      
      if (!isNaN(offset)) {
        qb.offset(offset);
      }
  
      if (!isNaN(limit)) {
        qb.limit(limit);
      }
  
      return qb;
    },
  
    calculatePaginationMeta(
      data: TPagination & { total: number }
    ): TPaginationMetadata {
      const total = data.total;
      const limit = isNaN(Number(data.limit)) ? total : Number(data.limit);
      const offset = isNaN(Number(data.offset)) ? 0 : Number(data.offset);
  
      const totalPages = Math.ceil(total / limit) || 0;
      const page = (Math.floor(offset / limit) || 0) + 1;
  
      return {
        totalPages,
        page,
        total,
        limit,
        offset
      };
    }
  };
}
