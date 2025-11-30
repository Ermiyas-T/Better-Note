// components/rich-text-editor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { useCallback, useEffect, useMemo, useState } from "react";
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
        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
        : "hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
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

  const initialContent = useMemo(() => {
    try {
      return content
        ? content
        : { type: "doc", content: [{ type: "paragraph" }] };
    } catch (e) {
      console.error("Failed to parse content:", e);
      return { type: "doc", content: [{ type: "paragraph" }] };
    }
  }, [content]);

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
              "bg-gray-100 dark:bg-gray-700 p-4 rounded font-mono text-sm my-4",
          },
        },
        code: {
          HTMLAttributes: {
            class:
              "bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono text-sm",
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
    content: initialContent,
    editorProps: {
      attributes: {
        class: `min-h-[300px] p-4 focus:outline-none dark:bg-gray-800 dark:text-gray-100 prose dark:prose-invert max-w-none ${className}`,
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getText());
    },
    immediatelyRender: false,
  });

  // Auto-save functionality
  useEffect(() => {
    if (!editor || !noteId) return;

    let timeoutId: NodeJS.Timeout;

    const handleUpdate = () => {
      if (!editor) return;
      setIsSaving(true);

      const content = editor.getText();
      updateNote({
        id: noteId,
        content,
      })
        .then(() => setLastSaved(new Date()))
        .catch(console.error)
        .finally(() => setIsSaving(false));
    };
    ``;

    const onUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleUpdate, 1000);
    };

    editor.on("update", onUpdate);
    return () => {
      clearTimeout(timeoutId);
      editor.off("update", onUpdate);
    };
  }, [editor, noteId]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!editor) return;

      // Don't handle keyboard shortcuts in code blocks except for Escape
      if (editor.isActive("codeBlock") && e.key !== "Escape") {
        return;
      }

      // Handle Escape key to exit code block
      if (e.key === "Escape" && editor.isActive("codeBlock")) {
        editor.chain().focus().exitCode().run();
        return;
      }

      // Only handle shortcuts with Ctrl or Cmd key
      if (!(e.ctrlKey || e.metaKey)) return;

      // Prevent default for all Ctrl/Cmd + key combinations
      if (e.key.match(/^[1-3e]$/i) || e.key === "\\") {
        e.preventDefault();
      }

      // Formatting shortcuts
      switch (e.key.toLowerCase()) {
        case "b":
          editor.chain().focus().toggleBold().run();
          break;
        case "i":
          editor.chain().focus().toggleItalic().run();
          break;
        case "e":
          editor.chain().focus().toggleCode().run();
          break;
        case "\\":
          editor.chain().focus().clearNodes().unsetAllMarks().run();
          break;
        case "1":
        case "2":
        case "3":
          if (e.altKey) {
            const level = parseInt(e.key) as 1 | 2 | 3;
            editor.chain().focus().toggleHeading({ level }).run();
          }
          break;
      }
    },
    [editor]
  );

  if (!editor) {
    return (
      <div className="border rounded-lg p-4 min-h-[200px] flex items-center justify-center text-gray-500">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700">
      {/* Toolbar */}
      <div className="flex flex-wrap justify-between items-center p-2 border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700 gap-1">
        <div className="flex flex-wrap gap-1 dark:text-gray-200">
          {/* Text Formatting */}
          <ToolButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editor.isActive("paragraph")}
            title="Paragraph (Ctrl+Alt+0)"
          >
            <Pilcrow className="w-4 h-4" />
          </ToolButton>

          {/* Headings */}
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

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Text Styles */}
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

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Lists */}
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

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Code */}
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

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Text Alignment */}
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

        {/* Save status */}
        <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
          {isSaving ? (
            <div className="bg-green-400 text-white font-semibold rounded-sm py-2 px-3 flex gap-2">
              Saving
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : lastSaved ? (
            `Last saved: ${lastSaved.toLocaleTimeString()}`
          ) : (
            ""
          )}
        </div>
      </div>

      {/* Editor content */}
      <div onKeyDown={handleKeyDown} className="dark:bg-gray-800">
        <EditorContent
          editor={editor}
          className="min-h-[500px] focus:outline-none"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
