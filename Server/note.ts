"use server";

import { insertNote, notes, Notes } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

async function getDb() {
  const { db } = await import("@/db/drizzle");
  return db;
}

interface renameNoteProps {
  id: string;
  title: string;
}
type getNoteProps = {
  notebookId: string;
};
interface noteProps {
  id: string;
}
interface updateNoteProps {
  id: string;
  content: string;
}
export const getNoteById = async ({ id }: noteProps) => {
  try {
    const db = await getDb();
    const data = await db.query.notes.findFirst({ where: eq(notes.id, id) });
    if (!data) {
      return { success: false, message: "Note not found" };
    }
    return {
      success: true,
      note: data,
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Failed to get note",
    };
  }
};
export const getNotes = async ({ notebookId }: getNoteProps) => {
  try {
    const db = await getDb();
    const data = await db.query.notes.findMany({
      where: eq(notes.notebookId, notebookId),
      orderBy: desc(notes.createdAt),
    });
    return { success: true, notes: data };
  } catch (e) {
    const error = e as Error;
    return {
      success: false,
      message: error.message,
    };
  }
};
export const createNote = async ({
  notebookId,
  title,
  content,
}: insertNote): Promise<{
  success: boolean;
  message: string;
  note?: Notes;
}> => {
  try {
    const db = await getDb();
    const [note] = await db
      .insert(notes)
      .values({ notebookId, title, content })
      .returning();
    return {
      success: true,
      message: "Note created successfully",
      note,
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Failed to create note",
    };
  }
};
export const renameNote = async ({
  id,
  title,
}: renameNoteProps): Promise<{
  success: boolean;
  message: string;
  note?: Notes;
}> => {
  try {
    const db = await getDb();
    const [note] = await db
      .update(notes)
      .set({ title })
      .where(eq(notes.id, id))
      .returning();
    return { success: true, message: "Note renamed successfully", note };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Failed to rename note",
    };
  }
};
export const updateNote = async ({ id, content }: updateNoteProps) => {
  try {
    const db = await getDb();
    await db.update(notes).set({ content: content }).where(eq(notes.id, id));
    return { success: true, message: "Note updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update the Note",
      error: error,
    };
  }
};
export const deleteNote = async (id: string) => {
  try {
    const db = await getDb();
    await db.delete(notes).where(eq(notes.id, id));
    return { success: true, message: "Note is deleted successfully" };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Failed to delete note",
    };
  }
};
