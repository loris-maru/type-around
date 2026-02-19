"use client";

import {
  BackgroundColor,
  Color,
  FontFamily,
  FontSize,
  LineHeight,
  TextStyle,
} from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import { useSpecimenPage } from "@/contexts/specimen-page-context";
import type { SpecimenPageCell } from "@/types/studio";

function ensureParagraphWrap(html: string): string {
  if (!html || html.trim() === "") return "<p></p>";
  const trimmed = html.trim();
  if (
    trimmed.startsWith("<p") ||
    trimmed.startsWith("<div")
  )
    return html;
  return `<p>${html}</p>`;
}

export default function TiptapCellEditor({
  cell,
  pageId,
  cellIndex,
  onBlur,
  cellStyle,
}: {
  cell: SpecimenPageCell;
  pageId: string;
  cellIndex: number;
  onBlur: (
    pageId: string,
    cellIndex: number,
    content: string
  ) => void;
  cellStyle: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    color: string;
    selectionBackgroundColor: string;
  };
}) {
  const {
    setActiveEditor,
    setSelectionAttributes,
    setSaveActiveCellContent,
  } = useSpecimenPage();
  const onBlurRef = useRef(onBlur);
  useEffect(() => {
    onBlurRef.current = onBlur;
  }, [onBlur]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        bulletList: false,
        orderedList: false,
        horizontalRule: false,
        hardBreak: false,
      }),
      TextStyle,
      FontSize,
      Color,
      BackgroundColor,
      FontFamily,
      LineHeight,
    ],
    content: ensureParagraphWrap(cell.content || ""),
    onBlur: ({ editor: e }) => {
      const html = e.getHTML();
      onBlurRef.current(pageId, cellIndex, html);
    },
    editorProps: {
      attributes: {
        class:
          "specimen-cell-content min-h-[1em] w-full flex-1 outline-none empty:before:content-['Type_here...'] empty:before:text-neutral-400 empty:before:pointer-events-none px-0 py-0",
        style: `font-family: ${cellStyle.fontFamily || "inherit"}; font-size: ${cellStyle.fontSize}px; line-height: ${cellStyle.lineHeight}; color: ${cellStyle.color}; --selection-bg: ${cellStyle.selectionBackgroundColor}`,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    setActiveEditor(editor);
    setSaveActiveCellContent(() => () => {
      const html = editor.getHTML();
      onBlurRef.current(pageId, cellIndex, html);
    });

    const updateSelectionAttrs = () => {
      const attrs = editor.getAttributes("textStyle");
      const sel = editor.state.selection;
      const empty = sel.empty;
      setSelectionAttributes(
        empty
          ? null
          : {
              fontSize: attrs.fontSize ?? null,
              color: attrs.color ?? null,
              backgroundColor:
                attrs.backgroundColor ?? null,
              fontFamily: attrs.fontFamily ?? null,
              lineHeight: attrs.lineHeight ?? null,
            }
      );
    };

    editor.on("selectionUpdate", updateSelectionAttrs);
    editor.on("transaction", updateSelectionAttrs);
    updateSelectionAttrs();

    return () => {
      setActiveEditor(null);
      setSelectionAttributes(null);
      setSaveActiveCellContent(null);
      editor.off("selectionUpdate", updateSelectionAttrs);
      editor.off("transaction", updateSelectionAttrs);
    };
  }, [
    editor,
    pageId,
    cellIndex,
    setActiveEditor,
    setSelectionAttributes,
    setSaveActiveCellContent,
  ]);

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = ensureParagraphWrap(cell.content || "");
    if (current !== next) {
      editor.commands.setContent(next, {
        emitUpdate: false,
      });
    }
  }, [editor, cell.content]);

  if (!editor) return null;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <EditorContent editor={editor} />
    </div>
  );
}
