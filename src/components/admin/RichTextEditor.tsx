"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

type RichTextEditorProps = {
  minHeight?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  value: string;
};

type ToolbarButtonProps = {
  active?: boolean;
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
};

export function RichTextEditor({
  minHeight = "160px",
  onChange,
  placeholder,
  value,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none text-sm text-text-primary [&_h2]:text-base [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_code]:rounded [&_code]:bg-surface [&_code]:px-1 [&_code]:font-mono [&_code]:text-accent [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:h-0 [&_.is-editor-empty:first-child::before]:text-text-muted [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
      },
    },
    onUpdate({ editor: activeEditor }) {
      onChange(activeEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === value) {
      return;
    }

    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  return (
    <div>
      <div className="flex gap-1 rounded-t-md border border-border border-b-0 bg-surface p-2">
        <ToolbarButton
          label="Bold"
          active={editor?.isActive("bold")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold size={14} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor?.isActive("italic")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic size={14} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 2"
          active={editor?.isActive("heading", { level: 2 })}
          disabled={!editor}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={14} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={editor?.isActive("heading", { level: 3 })}
          disabled={!editor}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 size={14} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={editor?.isActive("bulletList")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List size={14} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Ordered list"
          active={editor?.isActive("orderedList")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={14} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Code"
          active={editor?.isActive("code")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleCode().run()}
        >
          <Code size={14} aria-hidden="true" />
        </ToolbarButton>
      </div>

      <div
        className="rounded-b-md border border-border bg-bg p-3 text-sm text-text-primary"
        style={{ minHeight }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarButton({
  active,
  children,
  disabled,
  label,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      className={`rounded p-1 text-xs transition-colors ${
        active
          ? "bg-accent/10 text-accent"
          : "text-text-muted hover:bg-bg hover:text-text-primary"
      } disabled:cursor-not-allowed disabled:opacity-50`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
