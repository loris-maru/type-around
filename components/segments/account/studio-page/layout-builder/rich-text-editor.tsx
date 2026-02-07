"use client";

import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  RiAlignCenter,
  RiAlignLeft,
  RiAlignRight,
  RiBold,
  RiFontSize,
  RiItalic,
  RiLink,
  RiListUnordered,
  RiPaletteLine,
  RiStrikethrough,
  RiUnderline,
} from "react-icons/ri";
import { cn } from "@/utils/class-names";

type RichTextEditorProps = {
  content: string;
  onChange: (html: string) => void;
};

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
    ],
    content,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[200px] px-4 py-3 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const toggleLink = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt("Enter URL:");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const setFontSize = () => {
    const size = window.prompt(
      "Font size (e.g. 14px, 1.2em):"
    );
    if (size) {
      editor
        .chain()
        .focus()
        .setMark("textStyle", { fontSize: size })
        .run();
    }
  };

  const setColor = () => {
    const color = window.prompt(
      "Text color (e.g. #ff0000, red):"
    );
    if (color) {
      editor.chain().focus().setColor(color).run();
    }
  };

  return (
    <div className="border border-neutral-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-2 border-b border-neutral-200 bg-neutral-50">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          title="Bold"
        >
          <RiBold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          title="Italic"
        >
          <RiItalic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() =>
            editor.chain().focus().toggleUnderline().run()
          }
          title="Underline"
        >
          <RiUnderline className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("strike")}
          onClick={() =>
            editor.chain().focus().toggleStrike().run()
          }
          title="Strikethrough"
        >
          <RiStrikethrough className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-neutral-300 mx-1 self-center" />

        <ToolbarButton
          active={editor.isActive({ textAlign: "left" })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("left")
              .run()
          }
          title="Align left"
        >
          <RiAlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "center" })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("center")
              .run()
          }
          title="Align center"
        >
          <RiAlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "right" })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("right")
              .run()
          }
          title="Align right"
        >
          <RiAlignRight className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-neutral-300 mx-1 self-center" />

        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          title="Bullet list"
        >
          <RiListUnordered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("link")}
          onClick={toggleLink}
          title="Link"
        >
          <RiLink className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={false}
          onClick={setFontSize}
          title="Font size"
        >
          <RiFontSize className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          active={false}
          onClick={setColor}
          title="Text color"
        >
          <RiPaletteLine className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "p-1.5 rounded transition-colors cursor-pointer",
        active
          ? "bg-black text-white"
          : "text-neutral-600 hover:bg-neutral-200"
      )}
    >
      {children}
    </button>
  );
}
