CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "posts_table_title_trgm_index" ON "posts" USING gin ("title" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "posts_table_description_fts_index" ON "posts" USING gin (to_tsvector('english', "description"));