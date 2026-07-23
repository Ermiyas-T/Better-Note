"use server";
import { notebooks } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getDb() {
  const { db } = await import("@/db/drizzle");
  return db;
}

interface renameProps {
  id: string;
  name: string;
}
interface getNotebookProps {
  id: string;
}
const getUserId = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  if (!userId) {
    return undefined;
  }
  return userId;
};
export const getNotebooks = async () => {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, notebooks: [] };
    }
    const db = await getDb();
    const result = await db.query.notebooks.findMany({
      where: eq(notebooks.userId, userId),
      with: {
        notes: true,
      },
    });

    return { success: true, notebooks: result };
  } catch {
    return {
      success: false,
      notebooks: [],
    };
  }
};
export const getNotebookById = async ({ id }: getNotebookProps) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }
    const db = await getDb();
    const result = await db.query.notebooks.findFirst({
      where: and(eq(notebooks.id, id), eq(notebooks.userId, userId)),
      with: { notes: true },
    });
    return { success: true, notebook: result };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Failed to get notebook by id",
    };
  }
};
export const createNotebook = async ({ name, userId: _userId }: { name: string; userId?: string }) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id || _userId;
    if (!userId) {
      return { success: false, message: "User is not found" };
    }
    const db = await getDb();
    const [notebook] = await db
      .insert(notebooks)
      .values({ name, userId })
      .returning();
    return { success: true, message: "Notebook created successfully", notebook };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Failed to create notebook",
    };
  }
};
export const renameNotebookName = async ({ id, name }: renameProps) => {
  try {
    const db = await getDb();
    await db.update(notebooks).set({ name }).where(eq(notebooks.id, id));
    return { success: true, message: "Notebook renamed successfully" };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Failed to rename notebook",
    };
  }
};
export const deleteNotebook = async (id: string) => {
  try {
    const db = await getDb();
    await db.delete(notebooks).where(eq(notebooks.id, id));
    return { success: true, message: "Notebook deleted successfully" };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Failed to delete notebook",
    };
  }
};
