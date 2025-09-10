ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_user_id_event_id_pk";--> statement-breakpoint
ALTER TABLE "attendances" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "attendances" ALTER COLUMN "event_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "attendances" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "event_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "attendances" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "attendances" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role";