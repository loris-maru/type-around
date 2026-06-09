import { mergeAttributes, Node } from "@tiptap/core";

export const BlogVideo = Node.create({
  name: "blogVideo",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [{ tag: "video[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(HTMLAttributes, {
        controls: true,
        class: "my-4 w-full rounded-lg",
      }),
    ];
  },
});

export const BlogVideoEmbed = Node.create({
  name: "blogVideoEmbed",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [{ tag: "iframe[src]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        class:
          "blog-video-embed relative my-4 aspect-video w-full overflow-hidden rounded-lg",
      },
      [
        "iframe",
        mergeAttributes(HTMLAttributes, {
          class: "absolute inset-0 h-full w-full",
          allowfullscreen: "true",
          frameborder: "0",
        }),
      ],
    ];
  },
});
