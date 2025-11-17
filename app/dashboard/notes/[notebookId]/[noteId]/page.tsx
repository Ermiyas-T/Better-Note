import { getNoteById } from "@/Server/note";
import { notFound } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    notebookId: string;
    noteId: string;
  };
}

async function NotePage({ params }: PageProps) {
  const { noteId } = params;
  const result = await getNoteById(noteId);

  if (!result.success || !result.note) {
    notFound();
  }
  const { note } = result;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
      <div className="prose max-w-none">{note.content}</div>
    </div>
  );
}

export default NotePage;
