import PageWrapper from "@/components/page-wrapper";
import { RichTextEditor } from "@/components/rich-text-editor";
import { NoteHeader } from "@/components/note-header";
import { getNoteById } from "@/Server/note";
import { notFound } from "next/navigation";
import { getNotebookById } from "@/Server/notebook";

interface PageProps {
  params: {
    notebookId: string;
    noteId: string;
  };
}
async function NotePage({ params }: PageProps) {
  const { noteId, notebookId } = params;
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
  return (
    <PageWrapper
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        {
          label: notebook.name,
          href: `/dashboard/notebooks/${note.notebookId}`,
        },
        {
          label: note.title,
          href: `/dashboard/notebooks/${note.notebookId}/${note.id}`,
        },
      ]}
    >
      <div className="p-4">
        <NoteHeader
          noteId={note.id}
          notebookId={note.notebookId}
          initialTitle={note.title}
        />
        <RichTextEditor content={note.content} noteId={note?.id} />
      </div>
    </PageWrapper>
  );
}

export default NotePage;
