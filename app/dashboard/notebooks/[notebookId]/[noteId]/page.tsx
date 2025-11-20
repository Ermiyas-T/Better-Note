import PageWrapper from "@/components/page-wrapper";
import { getNoteById } from "@/Server/note";
import { notFound } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    notbookId: string;
    noteId: string;
  };
}

async function NotePage({ params }: PageProps) {
  const { noteId } = await params;
  const result = await getNoteById({ id: noteId });

  if (!result.success || !result.note) {
    notFound();
  }
  const { note } = result;

  return (
    <PageWrapper
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Notes", href: "/dashboard/notes" },
        { label: note.title, href: `/dashboard/notes/${note.id}` },
      ]}
    >
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
      </div>
    </PageWrapper>
  );
}

export default NotePage;
