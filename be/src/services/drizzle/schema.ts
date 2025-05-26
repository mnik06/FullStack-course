import { uuid, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const postTable = pgTable('posts', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 1000 }),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date())
});

// TODO: check if needed
export const postRelations = relations(postTable, ({ many }) => ({
  comments: many(commentTable)
}));

export const commentTable = pgTable('comments', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  text: varchar({ length: 255 }).notNull(),
  postId: uuid().references(() => postTable.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date())
});

// TODO: check if needed
export const commentRelations = relations(commentTable, ({ one }) => ({
  post: one(postTable, {
    fields: [commentTable.id],
    references: [postTable.id]
  })
}));
