import { and, eq, getTableColumns, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { commentTable, userTable } from 'src/services/drizzle/schema';
import { CommentSchema, TComment } from 'src/types/comment/schemas/Comment';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';

const getIsCommentNotDeletedFilter = () => {
  return isNull(commentTable.deletedAt);
};

export function getCommentRepo(db: NodePgDatabase): ICommentRepo {
  return {
    async createComment(data, user) {
      const [comment] = await db.insert(commentTable).values(data as TComment).returning();
      return CommentSchema.parse({ ...comment, user });
    },

    async getCommentById(id) {
      const isCommentNotDeletedFilter = getIsCommentNotDeletedFilter();

      const [comment] = await db
        .select({
          ...getTableColumns(commentTable),
          user: userTable
        })
        .from(commentTable)
        .where(and(eq(commentTable.id, id), isCommentNotDeletedFilter))
        .leftJoin(userTable, eq(commentTable.userId, userTable.id));

      return CommentSchema.parse(comment);
    },

    async getCommentsByPostId(postId) {
      const isCommentNotDeletedFilter = getIsCommentNotDeletedFilter();

      const comments = await db
        .select({
          ...getTableColumns(commentTable),
          user: userTable
        })
        .from(commentTable)
        .where(and(eq(commentTable.postId, postId), isCommentNotDeletedFilter))
        .leftJoin(userTable, eq(commentTable.userId, userTable.id));

      return CommentSchema.array().parse(comments);
    },

    async updateCommentById(id, data) {
      const isCommentNotDeletedFilter = getIsCommentNotDeletedFilter();

      const [comment] = await db
        .update(commentTable)
        .set(data as TComment)
        .where(and(eq(commentTable.id, id), isCommentNotDeletedFilter))
        .returning();

      const [user] = await db
        .select({
          ...getTableColumns(userTable)
        })
        .from(userTable)
        .where(eq(userTable.id, comment.userId));

      return comment ? CommentSchema.parse({ ...comment, user }) : null;
    },

    async deleteCommentHard(id) {
      const [comment] = await db.delete(commentTable).where(eq(commentTable.id, id)).returning();
      return !!comment;
    },

    async deleteCommentSoft(id) {
      const [comment] = await db
        .update(commentTable)
        .set({ deletedAt: new Date() })
        .where(eq(commentTable.id, id))
        .returning();

      return !!comment;
    }
  };
} 