import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { getPostRepo } from './post.repo';
import { getCommentRepo } from './comment.repo';
import { getUserProfileRepo } from './user-profile.repo';

export function getRepos(db: NodePgDatabase) {
  return {
    postRepo: getPostRepo(db),
    commentRepo: getCommentRepo(db),
    userProfileRepo: getUserProfileRepo(db)
  };
}

export type TRepos = ReturnType<typeof getRepos>;