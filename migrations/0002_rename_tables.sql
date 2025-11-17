-- Rename tables to use plural form
ALTER TABLE "note" RENAME TO "notes";
ALTER TABLE "notebook" RENAME TO "notebooks";

-- Update foreign key constraints
ALTER TABLE "notes" RENAME CONSTRAINT "note_notebook_id_notebook_id_fk" TO "notes_notebook_id_notebooks_id_fk";
ALTER TABLE "notebooks" RENAME CONSTRAINT "notebook_user_id_user_id_fk" TO "notebooks_user_id_user_id_fk";

-- Update sequence names if any
-- (PostgreSQL automatically creates sequences for serial columns)
ALTER SEQUENCE IF EXISTS "note_id_seq" RENAME TO "notes_id_seq";
ALTER SEQUENCE IF EXISTS "notebook_id_seq" RENAME TO "notebooks_id_seq";
