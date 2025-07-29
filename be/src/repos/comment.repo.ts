import { and, eq, getTableColumns, isNotNull, isNull, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { commentTable, userTable } from 'src/services/drizzle/schema';
import { CommentSchema, TComment } from 'src/types/comment/schemas/Comment';
import { CommentWithDeletedAtSchema } from 'src/types/comment/schemas/CommentWithDeletedAt';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';

const getIsCommentNotDeletedFilter = () => {
  return isNull(commentTable.deletedAt);
};

export function getCommentRepo(db: NodePgDatabase): ICommentRepo {
  return {
    async createComment(data) {
      const [[comment], [user]] = await Promise.all([
        db.insert(commentTable).values(data as TComment).returning(),
        db.select().from(userTable).where(eq(userTable.id, data.userId as string))
      ]);

      return comment ? CommentSchema.parse({ ...comment, user }) : null;
    },

    async createMultipleComments(data, transaction) {
      await transaction
        .insert(commentTable)
        .values(data as TComment[])
        .onConflictDoNothing({ target: commentTable.id });

      return true;
    },

    async getCommentById(id, skipDeleted = true) {
      const isCommentNotDeletedFilter = skipDeleted ? getIsCommentNotDeletedFilter() : undefined;

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

    async getCommentsByPostIds(postIds, skipDeleted = true) {
      const isCommentNotDeletedFilter = skipDeleted ? getIsCommentNotDeletedFilter() : undefined;

      const comments = await db
        .select({
          ...getTableColumns(commentTable),
          user: userTable
        })
        .from(commentTable)
        .where(and(inArray(commentTable.postId, postIds), isCommentNotDeletedFilter))
        .leftJoin(userTable, eq(commentTable.userId, userTable.id));

      return CommentSchema.array().parse(comments);
    },

    async getCommentsByUserId(userId, skipDeleted = true) {
      const isCommentNotDeletedFilter = skipDeleted ? getIsCommentNotDeletedFilter() : undefined;

      const comments = await db
        .select({
          ...getTableColumns(commentTable),
          user: userTable
        })
        .from(commentTable)
        .where(and(eq(commentTable.userId, userId), isCommentNotDeletedFilter))
        .leftJoin(userTable, eq(commentTable.userId, userTable.id));

      return CommentSchema.array().parse(comments);
    },

    async getComments({ userId } = {}) {
      const isCommentNotDeletedFilter = getIsCommentNotDeletedFilter();
      const userIdFilter = userId ? eq(commentTable.userId, userId) : undefined;

      const comments = await db
        .select({
          ...getTableColumns(commentTable),
          user: userTable
        })
        .from(commentTable)
        .where(and(userIdFilter, isCommentNotDeletedFilter))
        .leftJoin(userTable, eq(commentTable.userId, userTable.id));

      return CommentSchema.array().parse(comments);
    },

    async getSoftDeletedComments() {
      const comments = await db
        .select()
        .from(commentTable)
        .where(isNotNull(commentTable.deletedAt));

      return CommentWithDeletedAtSchema.array().parse(comments);
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
    },

    async restoreSoftDeletedComments(ids, transaction) {
      const dbToUse = transaction || db;

      await dbToUse
        .update(commentTable)
        .set({ deletedAt: null })
        .where(inArray(commentTable.id, ids));

      return true;
    }
  };
} 