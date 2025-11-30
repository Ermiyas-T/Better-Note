"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createNote, getNotes } from "@/Server/note";
import { getNotebookById, getNotebooks } from "@/Server/notebook";
import { Notes, insertNote } from "@/db/schema";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import PageWrapper from "@/components/page-wrapper";
interface NoteProps {
  id?:string;
  notebookId: string;
  title: string;
  content: string;
}
export default function NotebookPage() {
  const { notebookId } = useParams<{ notebookId: string }>();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [notes, setNotes] = useState<Notes[]>([]);
  const [note, setNote] = useState<NoteProps>({
    notebookId: notebookId,
    title: "",
    content: "",
  });
  const [notebook, setNotebook] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchNotebook();
    fetchNotes();
  }, [notebookId]);

  const fetchNotebook = async () => {
    try {
      setLoading(true);
      // Fetch notebook details
      const notebookResult = await getNotebookById({ id: notebookId });
      if (!notebookResult.success || !notebookResult.notebook) {
        toast.error("Notebook not found");
        return;
      }
      setNotebook(notebookResult.notebook);
    } catch (error) {
      console.error("Error fetching notebook data:", error);
      toast.error("Failed to load notebook");
    } finally {
      setLoading(false);
    }
  };
  const fetchNotes = async () => {
    const result = await getNotes({ notebookId });
    if (!result.success || !result.notes) {
      toast.error("Failed to load notes");
      return;
    }

    setNotes(result.notes);
  };

  const handleCreateNote = async () => {
    try {
      const session = await authClient.getSession();
      const userId = session?.data?.user?.id;

      if (!userId) {
        toast.error("Please sign in to create notes");
        return;
      }
      if (note.title === "" || note.notebookId === "") {
        toast.error("Couldn't create note");
      }
      const result = await createNote(note);
      // success message
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      await fetchNotes();
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
    <PageWrapper
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: `${notebook?.name}`, href: `/dashboard/notebooks/${notebookId}` },
        {
          label:`${note.title}`,
          href:`/dashboard/notebooks/${notebookId}/${note?.id}`
        }
      ]}
    >
      <div className="space-y-4 mx-4 mt-4 w-[calc(100%-2rem)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{notebook?.name || "Notebook"}</h2>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No notes yet</p>
            <Button onClick={() => setIsCreateDialogOpen((value) => !value)}>
              Create your first note
            </Button>
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
        {/* style the size making it dialog box and reduce the width */}
        <AlertDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Create Note</AlertDialogTitle>
              <AlertDialogDescription>
                Enter a title for your new note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Input
                value={note.title}
                onChange={(e) =>
                  setNote({ ...note, title: e.currentTarget.value })
                }
                placeholder="Notebook name"
                autoFocus
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCreateNote}
                disabled={!note?.title?.trim()}
              >
                Create Note
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageWrapper>
  );
}
