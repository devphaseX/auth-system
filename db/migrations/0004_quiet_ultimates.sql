ALTER TABLE "user" ALTER COLUMN "name" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "image" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");