"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { authClient } from "@/lib/auth-client";
import {
  getNotebooks as fetchNotebooksAction,
  deleteNotebook as deleteNotebookAction,
  createNotebook as createNotebookAction,
  renameNotebookName as renameNotebookAction,
} from "@/Server/notebook";
import type { Notes } from "@/db/schema";

export interface NotebookItem {
  id: string;
  name: string;
  notes: Notes[];
  userId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface NotebookContextType {
  notebooks: NotebookItem[];
  isLoading: boolean;
  refreshNotebooks: () => Promise<void>;
  createNotebook: (name: string) => Promise<void>;
  deleteNotebook: (id: string) => Promise<void>;
  renameNotebook: (id: string, name: string) => Promise<void>;
  addNote: (notebookId: string, note: Notes) => void;
  removeNote: (notebookId: string, noteId: string) => void;
  renameNoteInContext: (
    notebookId: string,
    noteId: string,
    title: string,
  ) => void;
}

const NotebookContext = createContext<NotebookContextType | null>(null);

export function NotebookProvider({ children }: { children: ReactNode }) {
  const [notebooks, setNotebooks] = useState<NotebookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = authClient.useSession();

  const refreshNotebooks = useCallback(async () => {
    const { notebooks } = await fetchNotebooksAction();
    if (notebooks) {
      setNotebooks(notebooks);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refreshNotebooks();
      setIsLoading(false);
    })();
  }, [refreshNotebooks]);

  const createNotebook = useCallback(async (name: string) => {
    const userId = session?.user.id;
    if (!userId) throw new Error("User not authenticated");
    const result = await createNotebookAction({ name, userId });

    if (!result.success) {
      throw new Error(result.message);
    }

    setNotebooks((prev) => [
      {
        id: result.notebook!.id,
        name: result.notebook!.name,
        notes: [],
        userId: result.notebook!.userId,
        createdAt: result.notebook!.createdAt,
        updatedAt: result.notebook!.updatedAt,
      },
      ...prev,
    ]);
  }, [session]);

  const deleteNotebook = useCallback(async (id: string) => {
    setNotebooks((prev) => prev.filter((n) => n.id !== id));

    const result = await deleteNotebookAction(id);

    if (!result.success) {
      setNotebooks((prev) => [...prev]);
      await refreshNotebooks();
      throw new Error(result.message);
    }
  }, [refreshNotebooks]);

  const renameNotebook = useCallback(async (id: string, name: string) => {
    const prev = notebooks.find((n) => n.id === id);
    setNotebooks((prev) =>
      prev.map((n) => (n.id === id ? { ...n, name } : n)),
    );

    const result = await renameNotebookAction({ id, name });

    if (!result.success) {
      if (prev) {
        setNotebooks((p) => p.map((n) => (n.id === id ? { ...n, name: prev.name } : n)));
      }
      throw new Error(result.message);
    }
  }, [notebooks]);

  const addNote = useCallback((notebookId: string, note: Notes) => {
    setNotebooks((prev) =>
      prev.map((n) =>
        n.id === notebookId ? { ...n, notes: [note, ...n.notes] } : n,
      ),
    );
  }, []);

  const removeNote = useCallback((notebookId: string, noteId: string) => {
    setNotebooks((prev) =>
      prev.map((n) =>
        n.id === notebookId
          ? { ...n, notes: n.notes.filter((note) => note.id !== noteId) }
          : n,
      ),
    );
  }, []);

  const renameNoteInContext = useCallback(
    (notebookId: string, noteId: string, title: string) => {
      setNotebooks((prev) =>
        prev.map((n) =>
          n.id === notebookId
            ? {
                ...n,
                notes: n.notes.map((note) =>
                  note.id === noteId ? { ...note, title } : note,
                ),
              }
            : n,
        ),
      );
    },
    [],
  );

  return (
    <NotebookContext.Provider
      value={{
        notebooks,
        isLoading,
        refreshNotebooks,
        createNotebook,
        deleteNotebook,
        renameNotebook,
        addNote,
        removeNote,
        renameNoteInContext,
      }}
    >
      {children}
    </NotebookContext.Provider>
  );
}

export function useNotebooks() {
  const ctx = useContext(NotebookContext);
  if (!ctx) throw new Error("useNotebooks must be used within NotebookProvider");
  return ctx;
}
