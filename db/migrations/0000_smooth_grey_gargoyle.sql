CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"password_salt" varchar(256) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
