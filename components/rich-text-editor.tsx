"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code as CodeIcon,
  Code2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Strikethrough,
  Pilcrow,
  Loader2,
} from "lucide-react";
import { updateNote } from "@/Server/note";

interface RichTextEditorProps {
  content?: string;
  noteId?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const ToolButton = ({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded transition-colors ${
      active
        ? "bg-primary/15 text-primary dark:bg-primary/25"
        : "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
    }`}
  >
    {children}
  </button>
);

export function RichTextEditor({
  content = "",
  placeholder = "Start writing...",
  className = "",
  noteId,
  onChange,
}: RichTextEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>(undefined);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "font-bold",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class:
              "bg-muted p-4 rounded font-mono text-sm my-4",
          },
        },
        code: {
          HTMLAttributes: {
            class:
              "bg-muted px-1.5 py-0.5 rounded font-mono text-sm",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-6 my-2",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-6 my-2",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: `min-h-[300px] p-4 focus:outline-none prose dark:prose-invert max-w-none ${className}`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) onChange(html);

      if (noteId) {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(async () => {
          setIsSaving(true);
          try {
            await updateNote({ id: noteId, content: html });
            setLastSaved(new Date());
          } catch (err) {
            console.error("Auto-save failed:", err);
          } finally {
            setIsSaving(false);
          }
        }, 1000);
      }
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!editor) return;

      if (editor.isActive("codeBlock")) {
        if (e.key === "Escape") {
          editor.chain().focus().exitCode().run();
        }
        return;
      }
    },
    [editor]
  );

  if (!editor) {
    return (
      <div className="border rounded-lg p-4 min-h-[200px] flex items-center justify-center text-muted-foreground">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap justify-between items-center p-2 border-b border-border bg-muted/30 gap-1">
        <div className="flex flex-wrap gap-1">
          <ToolButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editor.isActive("paragraph")}
            title="Paragraph (Ctrl+Alt+0)"
          >
            <Pilcrow className="w-4 h-4" />
          </ToolButton>

          {[1, 2, 3].map((level) => (
            <ToolButton
              key={level}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: level as 1 | 2 | 3 })
                  .run()
              }
              active={editor.isActive("heading", { level: level as 1 | 2 | 3 })}
              title={`Heading ${level} (Ctrl+Alt+${level})`}
            >
              {level === 1 && <Heading1 className="w-4 h-4" />}
              {level === 2 && <Heading2 className="w-4 h-4" />}
              {level === 3 && <Heading3 className="w-4 h-4" />}
            </ToolButton>
          ))}

          <div className="w-px h-6 bg-border mx-1" />

          <ToolButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            active={editor.isActive("highlight")}
            title="Highlight"
          >
            <Highlighter className="w-4 h-4" />
          </ToolButton>

          <div className="w-px h-6 bg-border mx-1" />

          <ToolButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolButton>

          <div className="w-px h-6 bg-border mx-1" />

          <ToolButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Inline Code (Ctrl+E)"
          >
            <CodeIcon className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            title="Code Block"
          >
            <Code2 className="w-4 h-4" />
          </ToolButton>

          <div className="w-px h-6 bg-border mx-1" />

          <ToolButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            active={editor.isActive({ textAlign: "justify" })}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </ToolButton>
        </div>

        <div className="text-xs text-muted-foreground ml-2">
          {isSaving ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/15 px-2.5 py-1.5 text-xs font-semibold text-primary">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving
            </span>
          ) : lastSaved ? (
            `Last saved: ${lastSaved.toLocaleTimeString()}`
          ) : (
            ""
          )}
        </div>
      </div>

      <div onKeyDown={handleKeyDown}>
        <EditorContent
          editor={editor}
          className="min-h-[500px] focus:outline-none"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
