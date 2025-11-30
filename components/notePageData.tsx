// here is the client component for note page data
"use client";
import { getNoteById } from "@/Server/note";
import { useEffect, useState } from "react";
interface NotePageDataProps {
  noteId: string;
}
export default function NotePageData({ noteId }: NotePageDataProps) {
  const [note, setNote] = useState({});
  useEffect(() => {
    const fetchNote = async () => {
      const result = await getNoteById({ id: noteId });
      if (!result.success || !result.note) {
        return;
      }
      setNote(result.note);
    };
    fetchNote();
  }, [noteId]);
  return note;
}
