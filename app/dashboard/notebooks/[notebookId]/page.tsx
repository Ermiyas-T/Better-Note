"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CalendarClock,
  Edit2Icon,
  EllipsisVertical,
  FileText,
  Plus,
  StickyNote,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { createNote, getNotes, renameNote, deleteNote } from "@/Server/note";
import { getNotebookById } from "@/Server/notebook";
import { Notes } from "@/db/schema";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import PageWrapper from "@/components/page-wrapper";
import { useNotebooks } from "@/components/notebook-context";

interface NoteProps {
  id?: string;
  notebookId: string;
  title: string;
  content: string;
}

function getNotePreview(content: string) {
  const plainText = content.replace(/<[^>]*>/g, "").trim();
  return plainText || "No content yet. Open this note to start writing.";
}

function formatNoteDate(date: Date | string | null) {
  if (!date) {
    return "No date available";
  }
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
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
  const { addNote, renameNoteInContext, removeNote } = useNotebooks();
  const router = useRouter();

  const [renameTarget, setRenameTarget] = useState<Notes | null>(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Notes | null>(null);

  const fetchNotebook = useCallback(async () => {
    try {
      setLoading(true);
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
  }, [notebookId]);

  const fetchNotes = useCallback(async () => {
    const result = await getNotes({ notebookId });
    if (!result.success || !result.notes) {
      toast.error("Failed to load notes");
      return;
    }
    setNotes(result.notes);
  }, [notebookId]);

  useEffect(() => {
    fetchNotebook();
    fetchNotes();
  }, [fetchNotebook, fetchNotes]);

  const handleCreateNote = async () => {
    if (note.title === "" || note.notebookId === "") {
      toast.error("Couldn't create note");
      return;
    }
    try {
      const result = await createNote(note);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      const createdNote = result.note!;
      setNote({ notebookId, title: "", content: "" });
      setIsCreateDialogOpen(false);
      setNotes((prev) => [createdNote, ...prev]);
      addNote(notebookId, createdNote);
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    }
  };

  const handleRenameNote = async () => {
    if (!renameTarget || !renameTitle.trim()) return;
    const target = renameTarget;
    setRenameTarget(null);
    setNotes((prev) =>
      prev.map((n) => (n.id === target.id ? { ...n, title: renameTitle } : n)),
    );
    renameNoteInContext(notebookId, target.id, renameTitle);
    const result = await renameNote({ id: target.id, title: renameTitle });
    if (!result.success) {
      setNotes((prev) =>
        prev.map((n) => (n.id === target.id ? { ...n, title: target.title } : n)),
      );
      renameNoteInContext(notebookId, target.id, target.title);
      toast.error(result.message);
    }
  };

  const handleDeleteNote = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    setNotes((prev) => prev.filter((n) => n.id !== target.id));
    removeNote(notebookId, target.id);
    await deleteNote(target.id);
    toast.success("Note deleted successfully");
  };

  if (loading) {
    return (
      <div className="mx-auto mt-4 w-full max-w-7xl space-y-6 px-4 pb-8">
        <div className="flex flex-col gap-4 rounded-2xl border bg-card/60 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border bg-card/80 shadow-sm"
            >
              <Skeleton className="h-1 w-full rounded-none" />
              <div className="p-5 pb-3">
                <div className="min-w-0 space-y-3">
                  <Skeleton className="h-11 w-11 rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5">
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
              <div className="flex items-center justify-between border-t bg-muted/20 px-5 py-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <PageWrapper
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        {
          label: `${notebook?.name || "Notebook"}`,
          href: `/dashboard/notebooks/${notebookId}`,
        },
      ]}
    >
      <div className="mx-auto mt-4 w-full max-w-7xl space-y-6 px-4 pb-8">
        <div className="flex flex-col gap-4 rounded-2xl border bg-card/60 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Notebook
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              {notebook?.name || "Notebook"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {notes.length} {notes.length === 1 ? "note" : "notes"} in this
              notebook.
            </p>
          </div>
          <Button
            className="w-full sm:w-auto"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>
        {notes.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 py-12 text-center">
            <div className="mb-4 rounded-2xl bg-primary/10 p-4 text-primary">
              <StickyNote className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold">No notes yet</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Capture your first idea in this notebook. A clear title is enough
              to get started.
            </p>
            <Button
              className="mt-6"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create your first note
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {notes.map((note) => (
              <Card
                key={note.id}
                role="button"
                tabIndex={0}
                onClick={() =>
                  router.push(`/dashboard/notebooks/${notebookId}/${note.id}`)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(
                      `/dashboard/notebooks/${notebookId}/${note.id}`,
                    );
                  }
                }}
                className="group relative overflow-hidden rounded-2xl border bg-card/80 py-0 shadow-sm outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-primary/30 to-transparent opacity-80" />
                <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 p-5 pb-3">
                  <div className="min-w-0 space-y-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="line-clamp-1 text-lg font-semibold tracking-tight">
                        {note.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1.5 text-xs">
                        <CalendarClock className="h-3.5 w-3.5" />
                        Updated {formatNoteDate(note.updatedAt)}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <EllipsisVertical className="h-4 w-4" />
                        <span className="sr-only">Note actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          setRenameTarget(note);
                          setRenameTitle(note.title);
                        }}
                      >
                        <Edit2Icon className="mr-2 h-4 w-4" />
                        <span>Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteTarget(note)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted-foreground">
                    {getNotePreview(note.content)}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t bg-muted/20 px-5 py-3 text-sm">
                  <span className="font-medium text-primary underline-offset-4 transition-all group-hover:underline group-hover:text-primary/80">
                    Open note
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary/60 transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

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
                placeholder="Note title"
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

        <AlertDialog
          open={!!renameTarget}
          onOpenChange={(open) => {
            if (!open) setRenameTarget(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Rename Note</AlertDialogTitle>
              <AlertDialogDescription>
                Enter a new title for this note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Input
                value={renameTitle}
                onChange={(e) => setRenameTitle(e.target.value)}
                placeholder="Note title"
                autoFocus
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRenameNote}
                disabled={!renameTitle?.trim()}
              >
                Save Changes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={!!deleteTarget}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Note</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{deleteTarget?.title}
                &quot;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteNote}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageWrapper>
  );
}
