"use client";

import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import {
  FontSize,
  LineHeight,
  TextStyle,
} from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import {
  RiAlignCenter,
  RiAlignLeft,
  RiAlignRight,
  RiBold,
  RiItalic,
  RiLink,
  RiLinkUnlink,
  RiListUnordered,
} from "react-icons/ri";
import { useEffect, useId, useState } from "react";
import { cn } from "@/utils/class-names";

const FONT_SIZES = [14, 16, 18, 24] as const;
const LINE_HEIGHTS = [1, 1.2, 1.5, 2] as const;

export type TiptapEditorProps = {
  value?: string;
  onChange?: (markdown: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export default function TiptapEditor({
  value,
  onChange,
  label,
  disabled = false,
  className,
}: TiptapEditorProps) {
  const labelId = useId();
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.5);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Markdown.configure({
        html: true,
        tightLists: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        codeBlock: false,
      }),
      TextStyle,
      FontSize,
      LineHeight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-blue-600 underline hover:text-blue-800",
        },
      }),
    ],
    content: value ?? "",
    onUpdate: ({ editor: e }) => {
      const storage = e.storage as {
        markdown?: { getMarkdown: () => string };
      };
      const markdown = storage.markdown?.getMarkdown?.();
      if (markdown !== undefined) {
        onChange?.(markdown);
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[200px] px-4 py-3 focus:outline-none [&_p]:mb-2 [&_p:last-child]:mb-0",
      },
    },
  });

  // Sync editor when value changes externally
  useEffect(() => {
    if (editor && value !== undefined) {
      const storage = editor.storage as {
        markdown?: { getMarkdown: () => string };
      };
      const current =
        storage.markdown?.getMarkdown?.() ?? "";
      if (value !== current) {
        editor.commands.setContent(value ?? "", {
          emitUpdate: false,
        });
      }
    }
  }, [value, editor]);

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

  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      {...(label && {
        role: "group",
        "aria-labelledby": labelId,
      })}
    >
      {label && (
        <span
          id={labelId}
          className="font-normal font-whisper text-black text-sm"
        >
          {label}
        </span>
      )}
      <div
        className={cn(
          "overflow-hidden rounded-lg border border-neutral-300 bg-white",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        {/* Sticky toolbar */}
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-neutral-200 border-b bg-neutral-50 p-2">
          <ToolbarButton
            active={editor.isActive("bold")}
            onClick={() =>
              editor.chain().focus().toggleBold().run()
            }
            title="Bold"
            disabled={disabled}
          >
            <RiBold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("italic")}
            onClick={() =>
              editor.chain().focus().toggleItalic().run()
            }
            title="Italic"
            disabled={disabled}
          >
            <RiItalic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("bulletList")}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBulletList()
                .run()
            }
            title="Bullet list"
            disabled={disabled}
          >
            <RiListUnordered className="h-4 w-4" />
          </ToolbarButton>

          <div className="mx-1 h-6 w-px self-center bg-neutral-300" />

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
            disabled={disabled}
          >
            <RiAlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive({
              textAlign: "center",
            })}
            onClick={() =>
              editor
                .chain()
                .focus()
                .setTextAlign("center")
                .run()
            }
            title="Align center"
            disabled={disabled}
          >
            <RiAlignCenter className="h-4 w-4" />
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
            disabled={disabled}
          >
            <RiAlignRight className="h-4 w-4" />
          </ToolbarButton>

          <div className="mx-1 h-6 w-px self-center bg-neutral-300" />

          {/* Font size dropdown */}
          <div className="flex items-center gap-1">
            <select
              value={fontSize}
              onChange={(e) => {
                const val = Number.parseInt(
                  e.target.value,
                  10
                ) as (typeof FONT_SIZES)[number];
                setFontSize(val);
                editor
                  .chain()
                  .focus()
                  .setFontSize(`${val}px`)
                  .run();
              }}
              onFocus={() => editor.commands.focus()}
              disabled={disabled}
              aria-label="Font size"
              className="h-8 rounded border border-neutral-300 bg-white px-2 font-whisper text-sm"
            >
              {FONT_SIZES.map((size) => (
                <option
                  key={size}
                  value={size}
                >
                  {size}px
                </option>
              ))}
            </select>
          </div>

          {/* Line height dropdown */}
          <div className="flex items-center gap-1">
            <select
              value={lineHeight}
              onChange={(e) => {
                const val = Number.parseFloat(
                  e.target.value
                ) as (typeof LINE_HEIGHTS)[number];
                setLineHeight(val);
                editor
                  .chain()
                  .focus()
                  .setLineHeight(String(val))
                  .run();
              }}
              onFocus={() => editor.commands.focus()}
              disabled={disabled}
              aria-label="Line height"
              className="h-8 rounded border border-neutral-300 bg-white px-2 font-whisper text-sm"
            >
              {LINE_HEIGHTS.map((lh) => (
                <option
                  key={lh}
                  value={lh}
                >
                  {lh}
                </option>
              ))}
            </select>
          </div>

          <div className="mx-1 h-6 w-px self-center bg-neutral-300" />

          <ToolbarButton
            active={editor.isActive("link")}
            onClick={toggleLink}
            title={
              editor.isActive("link")
                ? "Remove link"
                : "Add link"
            }
            disabled={disabled}
          >
            {editor.isActive("link") ? (
              <RiLinkUnlink className="h-4 w-4" />
            ) : (
              <RiLink className="h-4 w-4" />
            )}
          </ToolbarButton>
        </div>

        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  title,
  disabled,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      className={cn(
        "cursor-pointer rounded p-1.5 transition-colors",
        disabled
          ? "cursor-not-allowed opacity-50"
          : active
            ? "bg-black text-white"
            : "text-neutral-600 hover:bg-neutral-200"
      )}
    >
      {children}
    </button>
  );
}
