CREATE TABLE "archives" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"deleted_by" uuid NOT NULL,
	"deleted_at" timestamp DEFAULT now(),
	"entity_id" uuid NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "archives" ADD CONSTRAINT "archives_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;