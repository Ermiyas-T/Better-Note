import PageWrapper from "@/components/page-wrapper";
import { RichTextEditor } from "@/components/rich-text-editor";
import { getNoteById } from "@/Server/note";
import { notFound } from "next/navigation";
import { getNotebookById } from "@/Server/notebook";
// import React, { useState } from "react";

interface PageProps {
  params: {
    notebookId: string;
    noteId: string;
  };
}
async function NotePage({ params }: PageProps) {
  const { noteId,notebookId } = params;
  //fetch and get notebook title
  const notebookResult = await getNotebookById({ id: notebookId });
  if (!notebookResult.success || !notebookResult.notebook) {
    notFound();
  }
  const { notebook } = notebookResult;
  const result = await getNoteById({ id: noteId });

  if (!result.success || !result.note) {
    notFound();
  }
  const { note } = result;
  // const [noteState, setNoteState] = useState(note);
  return (
    <PageWrapper
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: notebook.name, href: `/dashboard/notebooks/${note.notebookId}` },
        {
          label: note.title,
          href: `/dashboard/notebooks/${note.notebookId}/${note.id}`,
        },
      ]}
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold pl-4 my-4">{note.title}</h2>
        <RichTextEditor content={note.content} noteId={note?.id} />
      </div>
    </PageWrapper>
  );
}

export default NotePage;
