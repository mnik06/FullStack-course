import { eq, getTableColumns } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { commentTable, userTable } from 'src/services/drizzle/schema';
import { CommentSchema, TComment } from 'src/types/comment/schemas/Comment';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';

export function getCommentRepo(db: NodePgDatabase): ICommentRepo {
  return {
    async createComment(data, user) {
      const [comment] = await db.insert(commentTable).values(data as TComment).returning();
      return CommentSchema.parse({ ...comment, user });
    },

    async getCommentById(id) {
      const [comment] = await db
        .select({
          ...getTableColumns(commentTable),
          user: userTable
        })
        .from(commentTable)
        .where(eq(commentTable.id, id))
        .leftJoin(userTable, eq(commentTable.userId, userTable.id));

      return CommentSchema.parse(comment);
    },

    async getCommentsByPostId(postId) {
      const comments = await db
        .select({
          ...getTableColumns(commentTable),
          user: userTable
        })
        .from(commentTable)
        .where(eq(commentTable.postId, postId))
        .leftJoin(userTable, eq(commentTable.userId, userTable.id));

      return CommentSchema.array().parse(comments);
    },

    async updateCommentById(id, data) {
      const [comment] = await db
        .update(commentTable)
        .set(data as TComment)
        .where(eq(commentTable.id, id))
        .returning();

      const [user] = await db
        .select({
          ...getTableColumns(userTable)
        })
        .from(userTable)
        .where(eq(userTable.id, comment.userId));

      return comment ? CommentSchema.parse({ ...comment, user }) : null;
    },

    async deleteComment(id) {
      const [comment] = await db.delete(commentTable).where(eq(commentTable.id, id)).returning();
      return !!comment;
    }
  };
} 