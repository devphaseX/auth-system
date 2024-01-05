ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "password_salt" DROP NOT NULL;