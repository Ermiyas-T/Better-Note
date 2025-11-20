"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createNote } from "@/Server/note";
import { getNotebookById } from "@/Server/notebook";
import { Notes } from "@/db/schema";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
interface props {
  params: {
    notebookId: string;
  };
}
export default function NotebookPage({ params }: props) {
  const { notebookId } = params;
  const [notes, setNotes] = useState<Notes[]>([]);
  const [notebook, setNotebook] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchNotebookAndNotes();
  }, [notebookId]);

  const fetchNotebookAndNotes = async () => {
    try {
      setLoading(true);
      // Fetch notebook details
      const notebookResult = await getNotebookById({ id: notebookId });
      if (!notebookResult.success || !notebookResult.notebook) {
        toast.error("Notebook not found");
        router.push("/dashboard");
        return;
      }
      setNotebook(notebookResult.notebook);

      // Fetch notes for this notebook
      if (notebookResult.success) {
        setNotes(notebookResult.notebook?.notes || []);
      }
    } catch (error) {
      console.error("Error fetching notebook data:", error);
      toast.error("Failed to load notebook");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    try {
      const session = await authClient.getSession();
      const userId = session?.data?.user?.id;

      if (!userId) {
        toast.error("Please sign in to create notes");
        return;
      }

      const result = await createNote({
        title: "Untitled Note",
        content: "",
        notebookId,
      });

      if (result.success && result.note) {
        router.push(`/dashboard/notebooks/${notebookId}/${result.note?.id}`);
      }
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    }
  };

  if (loading) {
    return (
      <div className="p-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{notebook?.name || "Notebook"}</h1>
        <Button onClick={handleCreateNote}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No notes yet</p>
          <Button onClick={handleCreateNote}>Create your first note</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card
              key={note.id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() =>
                router.push(`/dashboard/notebooks/${notebookId}/${note.id}`)
              }
            >
              <CardHeader>
                <CardTitle className="truncate">{note.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-muted-foreground">
                  {note.content || "No content"}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
