import { BinaryOperator, eq, getTableColumns, gt, gte, lt, lte, SelectedFields, SQL, SQLWrapper } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';

export interface IFiltersService {
  filterByOperator: Record<string, BinaryOperator>;
  parseNumericFilter(
    filter: string
  ): { operatorFunc: BinaryOperator; value: number; filterName: string };
  getNumericFilters<TTable extends PgTable>(
    table: TTable, 
    selection: SelectedFields<any, any>, 
    filters: string[]
  ): { whereFilters: SQLWrapper[]; havingFilters: SQLWrapper[] };
}

export function getFiltersService(): IFiltersService {
  return {
    filterByOperator: {
      '>=': gte,
      '>': gt,
      '<': lt,
      '<=': lte,
      '=': eq
    },

    parseNumericFilter(filter) {
      const [filterName, operator, value] = filter.split('_');

      return {
        operatorFunc: this.filterByOperator[operator as keyof typeof this.filterByOperator],
        value: Number(value),
        filterName
      };
    },

    getNumericFilters(table, selection, filters) {
      return filters.reduce((acc, filter) => {
        const { operatorFunc, value, filterName } = this.parseNumericFilter(filter);
        const tableColumns = getTableColumns(table);

        const tableColumn = tableColumns[filterName];
        const selectionColumn = selection[filterName];

        if (tableColumn) {
          acc.whereFilters.push(operatorFunc(tableColumn, value));
        } else if (selectionColumn) {

          acc.havingFilters.push(operatorFunc(selectionColumn, value));
        }

        return acc;
      }, { whereFilters: [] as SQL<unknown>[], havingFilters: [] as SQL<unknown>[] });
    }
  };
}

