import { uuid, pgTable, varchar, timestamp, index, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

const roleEnum = pgEnum('role', ['admin', 'user']);

export const postTable = pgTable('posts', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  userId: uuid().references(() => userTable.id, { onDelete: 'cascade' }).notNull(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 1000 }),
  readingTime: integer().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date())
}, (table) => {
  return [
    index('posts_table_title_trgm_index').using('gin', sql`${table.title} gin_trgm_ops`), 
    index('posts_table_description_fts_index').using('gin', sql`to_tsvector('english', ${table.description})`)
  ];
});

// TODO: check if needed
export const postRelations = relations(postTable, ({ many }) => ({
  comments: many(commentTable)
}));

export const commentTable = pgTable('comments', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  userId: uuid().references(() => userTable.id, { onDelete: 'cascade' }).notNull(),
  postId: uuid().references(() => postTable.id, { onDelete: 'cascade' }).notNull(),
  text: varchar({ length: 255 }).notNull(),
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

export const userTable = pgTable('users', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  subId: varchar({ length: 255 }).notNull(),
  role: roleEnum().default('user').notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date())
});
