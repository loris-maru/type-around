"use client";

import TextAlign from "@tiptap/extension-text-align";
import {
  FontSize,
  LineHeight,
  TextStyle,
} from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useId, useState } from "react";
import {
  RiAlignCenter,
  RiAlignLeft,
  RiAlignRight,
  RiBold,
  RiFontSize2,
  RiLineHeight,
} from "react-icons/ri";
import { cn } from "@/utils/class-names";

/** Convert plain text or HTML to editor content (TipTap expects HTML) */
function toEditorContent(
  value: string | undefined
): string {
  if (!value?.trim()) return "";
  // If it looks like HTML, use as-is
  if (value.trim().startsWith("<")) return value;
  // Plain text: wrap in paragraph
  return `<p>${value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;
}

export default function DescriptionEditor({
  value,
  onChange,
  label,
  disabled = false,
  className,
}: {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const labelId = useId();
  const [fontSize, setFontSizeState] = useState(16);
  const [lineHeight, setLineHeightState] = useState(1.5);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
      }),
      TextStyle,
      FontSize,
      LineHeight,
      TextAlign.configure({
        types: ["paragraph"],
      }),
    ],
    content: toEditorContent(value),
    onUpdate: ({ editor: e }) => {
      onChange?.(e.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[120px] w-full px-4 py-3 font-whisper text-base focus:outline-none [&_p]:mb-2 [&_p:last-child]:mb-0",
      },
    },
  });

  // Sync editor content when value changes externally (e.g. initial load)
  useEffect(() => {
    if (editor && value !== undefined) {
      const content = toEditorContent(value);
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content, {
          emitUpdate: false,
        });
      }
    }
  }, [value, editor]);

  if (!editor) return null;

  const handleFontSizeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = Number.parseInt(e.target.value, 10);
    setFontSizeState(Number.isNaN(val) ? 16 : val);
    if (!Number.isNaN(val) && val >= 8 && val <= 72) {
      editor.chain().focus().setFontSize(`${val}px`).run();
    }
  };

  const handleLineHeightChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = Number.parseFloat(e.target.value);
    setLineHeightState(Number.isNaN(val) ? 1.5 : val);
    if (!Number.isNaN(val) && val >= 1 && val <= 3) {
      editor
        .chain()
        .focus()
        .setLineHeight(String(val))
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
      <div className="overflow-hidden rounded-lg border border-neutral-300">
        <div className="flex flex-wrap gap-0.5 border-neutral-200 border-b bg-neutral-50 p-2">
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
          <div className="flex items-center gap-1">
            <RiFontSize2 className="h-4 w-4 shrink-0 text-neutral-600" />
            <input
              type="number"
              min={8}
              max={72}
              value={fontSize}
              onChange={handleFontSizeChange}
              onFocus={() => editor.commands.focus()}
              disabled={disabled}
              aria-label="Font size (px)"
              className="w-12 rounded border border-neutral-300 px-1 py-0.5 font-whisper text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <div className="flex items-center gap-1">
            <RiLineHeight className="h-4 w-4 shrink-0 text-neutral-600" />
            <input
              type="number"
              min={1}
              max={3}
              step={0.1}
              value={lineHeight}
              onChange={handleLineHeightChange}
              onFocus={() => editor.commands.focus()}
              disabled={disabled}
              aria-label="Line height"
              className="w-12 rounded border border-neutral-300 px-1 py-0.5 font-whisper text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>
        <div
          className={cn(
            "bg-white",
            disabled &&
              "cursor-not-allowed bg-neutral-100 opacity-60"
          )}
          aria-disabled={disabled}
        >
          <EditorContent editor={editor} />
        </div>
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
