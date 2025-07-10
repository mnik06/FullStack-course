import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { getPostRepo } from './post.repo';
import { getCommentRepo } from './comment.repo';
import { getUserProfileRepo } from './user-profile.repo';
import { getTagRepo } from './tag.repo';
import { getPostToTagRepo } from './post-to-tag.repo';
import { getArchiveRepo } from './archive.repo';

export function getRepos(db: NodePgDatabase) {
  return {
    postRepo: getPostRepo(db),
    commentRepo: getCommentRepo(db),
    userProfileRepo: getUserProfileRepo(db),
    tagRepo: getTagRepo(db),
    postToTagRepo: getPostToTagRepo(db),
    archiveRepo: getArchiveRepo(db)
  };
}

export type TRepos = ReturnType<typeof getRepos>;