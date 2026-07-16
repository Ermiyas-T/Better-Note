import { neon } from "@neondatabase/serverless";
import { existsSync, readFileSync } from "node:fs";

if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);

    if (!match || match[1].startsWith("#") || process.env[match[1]]) {
      continue;
    }

    process.env[match[1]] = (match[2] ?? "").replace(/^['"]|['"]$/g, "");
  }
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not defined.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const statements = [
  `CREATE TABLE IF NOT EXISTS "user" (
    "id" text PRIMARY KEY NOT NULL,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "email_verified" boolean DEFAULT false NOT NULL,
    "image" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "user_email_unique" UNIQUE("email")
  )`,
  `CREATE TABLE IF NOT EXISTS "session" (
    "id" text PRIMARY KEY NOT NULL,
    "expires_at" timestamp NOT NULL,
    "token" text NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp NOT NULL,
    "ip_address" text,
    "user_agent" text,
    "user_id" text NOT NULL,
    CONSTRAINT "session_token_unique" UNIQUE("token")
  )`,
  `CREATE TABLE IF NOT EXISTS "account" (
    "id" text PRIMARY KEY NOT NULL,
    "account_id" text NOT NULL,
    "provider_id" text NOT NULL,
    "user_id" text NOT NULL,
    "access_token" text,
    "refresh_token" text,
    "id_token" text,
    "access_token_expires_at" timestamp,
    "refresh_token_expires_at" timestamp,
    "scope" text,
    "password" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "verification" (
    "id" text PRIMARY KEY NOT NULL,
    "identifier" text NOT NULL,
    "value" text NOT NULL,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "notebooks" (
    "id" text PRIMARY KEY NOT NULL,
    "name" text NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "user_id" text NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "notes" (
    "id" text PRIMARY KEY NOT NULL,
    "notebook_id" text NOT NULL,
    "title" text NOT NULL,
    "content" text NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
  )`,
  `DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'account_user_id_user_id_fk') THEN
      ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $$`,
  `DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_user_id_user_id_fk') THEN
      ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $$`,
  `DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notebooks_user_id_user_id_fk') THEN
      ALTER TABLE "notebooks" ADD CONSTRAINT "notebooks_user_id_user_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $$`,
  `DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notes_notebook_id_notebooks_id_fk') THEN
      ALTER TABLE "notes" ADD CONSTRAINT "notes_notebook_id_notebooks_id_fk"
      FOREIGN KEY ("notebook_id") REFERENCES "public"."notebooks"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $$`,
];

for (const statement of statements) {
  await sql.query(statement);
}

console.log("Database schema is ready.");
