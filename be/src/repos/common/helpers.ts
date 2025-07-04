import { sql, type SQL, SelectedFields, and } from 'drizzle-orm';
import { type SelectResultFields } from 'node_modules/drizzle-orm/query-builders/select.types';

export function jsonBuildObject<T extends SelectedFields<any, any>>(shape: T) {
  const chunks: SQL[] = [];

  Object.entries(shape).forEach(([key, value]) => {
    if (chunks.length > 0) {
      chunks.push(sql.raw(','));
    }

    chunks.push(sql.raw(`'${key}',`));
    chunks.push(sql`${value}`);
  });

  return sql<SelectResultFields<T>>`json_build_object(${sql.join(
    chunks
  )})`;
}

export function jsonAggBuildObject<
  T extends SelectedFields<any, any>,
>(
  shape: T
) {
  return sql<SelectResultFields<T>[]>`coalesce(
    json_agg(${jsonBuildObject(shape)})
    FILTER (WHERE ${and(
    sql.join(
      Object.values(shape).map((value) => sql`${sql`${value}`} IS NOT NULL`),
      sql` AND `
    )
  )})
    ,'${sql`[]`}')`;
}

export const totalCountOver = () => {
  return sql<number>`cast(count(*) over() as int)`; 
};