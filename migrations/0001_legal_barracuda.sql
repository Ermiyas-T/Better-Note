CREATE TABLE "notebook" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "note" (
	"id" text PRIMARY KEY NOT NULL,
	"notebook_id" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notebook" ADD CONSTRAINT "notebook_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note" ADD CONSTRAINT "note_notebook_id_notebook_id_fk" FOREIGN KEY ("notebook_id") REFERENCES "public"."notebook"("id") ON DELETE cascade ON UPDATE no action;