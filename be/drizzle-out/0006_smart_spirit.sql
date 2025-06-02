ALTER TABLE "posts" ADD COLUMN "reading_time" integer;

UPDATE "posts" SET "reading_time" = CEIL(LENGTH(description) / 3.3);

ALTER TABLE "posts" ALTER COLUMN "reading_time" SET NOT NULL;