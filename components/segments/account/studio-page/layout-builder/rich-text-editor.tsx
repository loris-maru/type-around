"use client";

import Image from "@tiptap/extension-image";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";
import {
  RiAlignCenter,
  RiAlignLeft,
  RiAlignRight,
  RiBold,
  RiFontSize,
  RiImageLine,
  RiItalic,
  RiLink,
  RiListUnordered,
  RiLoader4Line,
  RiPaletteLine,
  RiStrikethrough,
  RiUnderline,
  RiVideoLine,
} from "react-icons/ri";
import {
  BLOG_ARTICLE_IMAGE_ACCEPT,
  BLOG_ARTICLE_VIDEO_ACCEPT,
} from "@/constant/BLOG_ARTICLE_MEDIA_ACCEPT";
import { uploadFile } from "@/lib/firebase/storage";
import type { RichTextEditorProps } from "@/types/components";
import { getBlogVideoEmbedUrl } from "@/utils/blog-video-embed-url";
import { cn } from "@/utils/class-names";
import {
  BlogVideo,
  BlogVideoEmbed,
} from "@/utils/tiptap-blog-media-extensions";

export default function RichTextEditor({
  content,
  onChange,
  studioId,
  enableMedia = false,
}: RichTextEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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
      ...(enableMedia
        ? [
            Image.configure({
              HTMLAttributes: {
                class: "my-4 w-full max-w-full rounded-lg",
              },
            }),
            BlogVideo,
            BlogVideoEmbed,
          ]
        : []),
    ],
    content,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[200px] px-4 py-3 focus:outline-none [&_img]:my-4 [&_img]:w-full [&_img]:max-w-full [&_img]:rounded-lg [&_video]:my-4 [&_video]:w-full [&_video]:rounded-lg [&_.blog-video-embed]:my-4",
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

  const insertImage = (src: string) => {
    editor.chain().focus().setImage({ src }).run();
  };

  const insertVideo = (
    src: string,
    type: "embed" | "file"
  ) => {
    if (type === "embed") {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "blogVideoEmbed",
          attrs: { src },
        })
        .run();
      return;
    }

    editor
      .chain()
      .focus()
      .insertContent({
        type: "blogVideo",
        attrs: { src },
      })
      .run();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !studioId || isUploading) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(
        file,
        "images",
        studioId
      );
      insertImage(url);
    } catch (error) {
      console.error("Image upload failed:", error);
      window.alert(
        "Failed to upload image. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !studioId || isUploading) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(
        file,
        "layout",
        studioId
      );
      insertVideo(url, "file");
    } catch (error) {
      console.error("Video upload failed:", error);
      window.alert(
        "Failed to upload video. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddImage = () => {
    if (!studioId) {
      const url = window.prompt("Enter image URL:");
      if (url?.trim()) insertImage(url.trim());
      return;
    }
    imageInputRef.current?.click();
  };

  const handleAddVideo = () => {
    const url = window.prompt(
      "Paste a video URL (YouTube, Vimeo, or direct file), or leave blank to upload a file:"
    );

    if (!url?.trim()) {
      if (studioId) {
        videoInputRef.current?.click();
      }
      return;
    }

    const parsed = getBlogVideoEmbedUrl(url);
    if (parsed) {
      insertVideo(parsed.src, parsed.type);
      return;
    }

    window.alert(
      "Could not use that video URL. Try YouTube, Vimeo, or a direct .mp4/.webm link."
    );
  };

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-300">
      {enableMedia && studioId && (
        <>
          <input
            ref={imageInputRef}
            type="file"
            accept={BLOG_ARTICLE_IMAGE_ACCEPT}
            className="hidden"
            onChange={handleImageUpload}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept={BLOG_ARTICLE_VIDEO_ACCEPT}
            className="hidden"
            onChange={handleVideoUpload}
          />
        </>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 border-neutral-200 border-b bg-neutral-50 p-2">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          title="Bold"
        >
          <RiBold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          title="Italic"
        >
          <RiItalic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() =>
            editor.chain().focus().toggleUnderline().run()
          }
          title="Underline"
        >
          <RiUnderline className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("strike")}
          onClick={() =>
            editor.chain().focus().toggleStrike().run()
          }
          title="Strikethrough"
        >
          <RiStrikethrough className="h-4 w-4" />
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
        >
          <RiAlignLeft className="h-4 w-4" />
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
        >
          <RiAlignRight className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px self-center bg-neutral-300" />

        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          title="Bullet list"
        >
          <RiListUnordered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("link")}
          onClick={toggleLink}
          title="Link"
        >
          <RiLink className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={false}
          onClick={setFontSize}
          title="Font size"
        >
          <RiFontSize className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={false}
          onClick={setColor}
          title="Text color"
        >
          <RiPaletteLine className="h-4 w-4" />
        </ToolbarButton>

        {enableMedia && (
          <>
            <div className="mx-1 h-6 w-px self-center bg-neutral-300" />
            <ToolbarButton
              active={false}
              onClick={handleAddImage}
              title="Add image"
            >
              {isUploading ? (
                <RiLoader4Line className="h-4 w-4 animate-spin" />
              ) : (
                <RiImageLine className="h-4 w-4" />
              )}
            </ToolbarButton>
            <ToolbarButton
              active={false}
              onClick={handleAddVideo}
              title="Add video"
            >
              <RiVideoLine className="h-4 w-4" />
            </ToolbarButton>
          </>
        )}
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
      aria-label={title}
      aria-pressed={active}
      className={cn(
        "cursor-pointer rounded p-1.5 transition-colors",
        active
          ? "bg-black text-white"
          : "text-neutral-600 hover:bg-neutral-200"
      )}
    >
      {children}
    </button>
  );
}
