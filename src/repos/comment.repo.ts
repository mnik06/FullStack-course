import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { commentTable } from 'src/services/drizzle/schema';
import { CommentSchema, TComment } from 'src/types/db/Comment';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';

export function getCommentRepo(db: NodePgDatabase): ICommentRepo {
  return {
    async createComment(data) {
      const comment = await db.insert(commentTable).values(data as TComment).returning();
      return CommentSchema.parse(comment[0]);
    },

    async getComments() {
      const comments = await db.select().from(commentTable);
      return comments.map(comment => CommentSchema.parse(comment));
    },

    async getCommentById(id) {
      const comment = await db.select().from(commentTable).where(eq(commentTable.id, id));
      return comment.length > 0 ? CommentSchema.parse(comment[0]) : null;
    },

    async updateCommentById(id, data) {
      const comments = await db
        .update(commentTable)
        .set(data as TComment)
        .where(eq(commentTable.id, id))
        .returning();
      return comments.length > 0 ? CommentSchema.parse(comments[0]) : null;
    }
  };
} 