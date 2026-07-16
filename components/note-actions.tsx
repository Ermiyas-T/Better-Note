"use client";

import { useState } from "react";
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2Icon, EllipsisVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { renameNote, deleteNote } from "@/Server/note";
import { useNotebooks } from "@/components/notebook-context";

interface NoteActionsProps {
  noteId: string;
  notebookId: string;
  initialTitle: string;
  onTitleChange?: (title: string) => void;
}

export function NoteActions({
  noteId,
  notebookId,
  initialTitle,
  onTitleChange,
}: NoteActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const { renameNoteInContext, removeNote } = useNotebooks();
  const router = useRouter();

  const handleRename = async () => {
    if (!title.trim()) return;
    setIsRenameDialogOpen(false);
    renameNoteInContext(notebookId, noteId, title);
    onTitleChange?.(title);
    const result = await renameNote({ id: noteId, title });
    if (!result.success) {
      renameNoteInContext(notebookId, noteId, initialTitle);
      onTitleChange?.(initialTitle);
      toast.error(result.message);
    }
  };

  const handleDelete = async () => {
    setIsDeleteDialogOpen(false);
    removeNote(notebookId, noteId);
    await deleteNote(noteId);
    toast.success("Note deleted successfully");
    router.push(`/dashboard/notebooks/${notebookId}`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <EllipsisVertical className="h-4 w-4" />
            <span className="sr-only">Note actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
            <Edit2Icon className="mr-2 h-4 w-4" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              autoFocus
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRename}
              disabled={!title.trim()}
            >
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
