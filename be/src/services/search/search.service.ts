import {  or, sql, SQL } from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';

interface ISearchService {
  getSearchFilters(params: { 
    searchQuery?: string; 
    trgmSearchColumns?: PgColumn[]; 
    tsVectorSearchColumns?: PgColumn[] 
  }): SQL | undefined;
}

export function getSearchService(): ISearchService {
  return {
    getSearchFilters(params) {
      const { searchQuery, trgmSearchColumns, tsVectorSearchColumns } = params;

      const searchFilters = [];

      if (!searchQuery) {
        return undefined;
      }

      if (trgmSearchColumns) {
        searchFilters.push(
          or(...trgmSearchColumns.map((column) => sql`WORD_SIMILARITY(${searchQuery}, ${column}) > 0.5`))
        );
      }

      if (tsVectorSearchColumns) {
        searchFilters.push(
          or(...tsVectorSearchColumns.map((column) => sql`to_tsvector('english', ${column}) @@ plainto_tsquery(${searchQuery})`))
        );
      }

      return or(...searchFilters);
    }
  };
}