ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true;

UPDATE "users" SET "is_active" = true WHERE "is_active" IS NULL;

ALTER TABLE "users" ALTER COLUMN "is_active" SET NOT NULL;