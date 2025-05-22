import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { getPostRepo } from './post.repo';

export function getRepos(db: NodePgDatabase) {
  return {
    postRepo: getPostRepo(db)
  };
}

export type TRepos = ReturnType<typeof getRepos>;