"use client";

import { useState } from "react";
import { NoteActions } from "./note-actions";

interface NoteHeaderProps {
  noteId: string;
  notebookId: string;
  initialTitle: string;
}

export function NoteHeader({
  noteId,
  notebookId,
  initialTitle,
}: NoteHeaderProps) {
  const [title, setTitle] = useState(initialTitle);

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold pl-4 my-4">{title}</h2>
      <NoteActions
        noteId={noteId}
        notebookId={notebookId}
        initialTitle={initialTitle}
        onTitleChange={setTitle}
      />
    </div>
  );
}
