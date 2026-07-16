"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  Edit2Icon,
  EllipsisVertical,
  ArrowRight,
  BookOpen,
  CalendarClock,
  FileText,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { convertDate } from "@/lib/date-converter";
import { useNotebooks, type NotebookItem } from "./notebook-context";

function NoteBooks() {
  const { notebooks, isLoading, createNotebook, deleteNotebook, renameNotebook } =
    useNotebooks();
  const [selectedNotebook, setSelectedNotebook] = useState<NotebookItem | null>(null);
  const [notebookCreateLoading, setNotebookCreateLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [notebookName, setNotebookName] = useState("");
  const [newNotebookName, setNewNotebookName] = useState("");
  const router = useRouter();

  const handleDeleteClick = (notebook: NotebookItem) => {
    setSelectedNotebook(notebook);
    setIsDeleteDialogOpen(true);
  };

  const handleRenameClick = (id: string) => {
    const notebook = notebooks.find((n) => n.id === id) || null;
    setSelectedNotebook(notebook);
    if (!notebook) return;
    setNewNotebookName(notebook.name);
    setIsRenameDialogOpen(true);
  };

  const handleCreateNotebookClick = () => {
    setIsCreateDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedNotebook) return;
    setIsDeleteDialogOpen(false);
    setSelectedNotebook(null);
    toast.promise(deleteNotebook(selectedNotebook.id), {
      loading: "Deleting notebook...",
      success: "Notebook deleted successfully",
      error: (err) => err.message || "Failed to delete notebook",
    });
  };

  const handleRename = async () => {
    if (!newNotebookName?.trim() || !selectedNotebook?.id) return;
    setIsRenameDialogOpen(false);
    setSelectedNotebook(null);
    toast.promise(renameNotebook(selectedNotebook.id, newNotebookName), {
      loading: "Renaming notebook...",
      success: "Notebook renamed successfully",
      error: (err) => err.message || "Failed to rename notebook",
    });
  };

  const handleCreateNotebook = async (name: string) => {
    setNotebookCreateLoading(true);
    try {
      await createNotebook(name);
      toast.success("Notebook created successfully");
      setNotebookName("");
      setIsCreateDialogOpen(false);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to create notebook");
    } finally {
      setNotebookCreateLoading(false);
    }
  };

  const handleNotebookClick = (notebook: NotebookItem) => {
    router.push(`/dashboard/notebooks/${notebook.id}`);
  };

  if (isLoading) {
    return (
      <div className="mx-auto mt-8 grid w-full grid-cols-1 gap-4 px-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-44 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto mt-4 w-full max-w-7xl space-y-6 px-4 pb-8">
      <div className="flex flex-col gap-4 rounded-2xl border bg-card/60 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Workspace
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            My Notebooks
          </h2>
          <p className="text-sm text-muted-foreground">
            Organize ideas, drafts, and research into focused notebooks.
          </p>
        </div>
        <Button onClick={handleCreateNotebookClick} className="w-full sm:w-auto">
          {notebookCreateLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <span className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              New Notebook
            </span>
          )}
        </Button>
      </div>
      {notebooks.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 py-12 text-center">
          <div className="mb-4 rounded-2xl bg-primary/10 p-4 text-primary">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold">No notebooks yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Create your first notebook to start grouping related notes in one
            clean place.
          </p>
          <Button className="mt-6" onClick={handleCreateNotebookClick}>
            <Plus className="mr-2 h-4 w-4" />
            Create notebook
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {notebooks.map((notebook) => (
            <Card
              key={notebook.id}
              role="button"
              tabIndex={0}
              onClick={() => handleNotebookClick(notebook)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleNotebookClick(notebook);
                }
              }}
              className="group relative overflow-hidden rounded-2xl border bg-card/80 py-0 shadow-sm outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-primary/30 to-transparent opacity-80" />
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 p-5 pb-3">
                <div className="min-w-0 space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-1 text-lg font-semibold tracking-tight">
                      {notebook.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-xs">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {notebook.updatedAt
                        ? `Updated ${convertDate(notebook.updatedAt)}`
                        : notebook.createdAt
                        ? `Created ${convertDate(notebook.createdAt)}`
                        : "No date available"}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <EllipsisVertical className="h-4 w-4" />
                      <span className="sr-only">More notebook actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <DropdownMenuItem
                      onClick={() => handleRenameClick(notebook.id)}
                    >
                      <Edit2Icon className="mr-2 h-4 w-4" />
                      <span>Rename</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteClick(notebook)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>
                    {notebook?.notes?.length || 0}{" "}
                    {(notebook?.notes?.length || 0) === 1 ? "note" : "notes"}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t bg-muted/20 px-5 py-3 text-sm">
                <span className="font-medium text-primary underline-offset-4 transition-all group-hover:underline group-hover:text-primary/80">
                  Open notebook
                </span>
                <ArrowRight className="h-4 w-4 text-primary/60 transition-all group-hover:translate-x-1 group-hover:text-primary" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the notebook &quot;
              {selectedNotebook?.name}&quot; and all its contents. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename Notebook</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new name for the notebook.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={newNotebookName}
              onChange={(e) => setNewNotebookName(e.target.value)}
              placeholder="Notebook name"
              autoFocus
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRename}
              disabled={!newNotebookName?.trim()}
            >
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Notebook</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a name for the notebook.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={notebookName}
              onChange={(e) => setNotebookName(e.target.value)}
              placeholder="Notebook name"
              autoFocus
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleCreateNotebook(notebookName)}
              disabled={!notebookName.trim()}
            >
              Create Notebook
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default NoteBooks;
