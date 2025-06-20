CREATE TYPE "role" AS ENUM ('admin', 'user');

ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'user';

UPDATE "users" SET "role" = 'user' WHERE "role" IS NULL;

ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;
