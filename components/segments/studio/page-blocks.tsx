"use client";

import StudioBlogBlock from "@/components/segments/studio/blog-block";
import FontsInUseList from "@/components/segments/studio/fonts-in-use-list";
import StudioGallery from "@/components/segments/studio/gallery";
import StudioImageBlock from "@/components/segments/studio/image-block";
import StudioProfile from "@/components/segments/studio/profile";
import StudioSpacerBlock from "@/components/segments/studio/spacer-block";
import StudioStoreBlock from "@/components/segments/studio/store-block";
import TypefacesList from "@/components/segments/studio/typefaces-list";
import StudioVideoBlock from "@/components/segments/studio/video-block";
import TypeTester from "@/components/segments/type-tester";
import type {
  BlogBlockData,
  GalleryBlockData,
  ImageBlockData,
  LayoutItem,
  SpacerBlockData,
  StoreBlockData,
  TypefaceListBlockData,
  VideoBlockData,
} from "@/types/layout";
import type { Studio } from "@/types/studio";
import type { Studio as DisplayStudio } from "@/types/typefaces";

type TypefaceMeta = {
  slug: string;
  displayFontFile: string;
  fontLineText: string;
};

type StudioPageBlocksProps = {
  blocks: LayoutItem[];
  studio: Studio;
  typefaceMeta: TypefaceMeta[];
};

function toDisplayStudio(studio: Studio): DisplayStudio {
  return {
    id: studio.id,
    name: studio.name,
    description: "",
    image:
      studio.thumbnail ||
      studio.avatar ||
      "/placeholders/studio_image_placeholder.webp",
    website: studio.website,
    email: studio.contactEmail,
    imageCover: studio.thumbnail || "",
    gradient: [
      studio.gradient?.from || "#FFF8E8",
      studio.gradient?.to || "#F2F2F2",
    ],
    socialMedia: studio.socialMedia.map((sm) => ({
      name: sm.name,
      href: sm.url,
      service: sm.name.toLowerCase(),
    })),
    typefaces: studio.typefaces.map((tf, index) => ({
      id: index,
      category: tf.category || [],
      name: tf.name,
      hangeulName: tf.hangeulName || "",
      slug: tf.slug,
      description: tf.description,
      icon: tf.headerImage || "",
      fonts: tf.fonts.map((f) => ({
        price: f.printPrice || f.price || 0,
        text: f.text || "",
        fullName: f.fullName || f.styleName,
        name: f.name || f.styleName,
        weight: f.weight,
        style:
          f.style || (f.isItalic ? "italic" : "normal"),
      })),
      characters: tf.characters,
      releaseDate: tf.releaseDate,
      studio: tf.studio,
      gradient: tf.gradient,
    })),
  };
}

export default function StudioPageBlocks({
  blocks,
  studio,
  typefaceMeta,
}: StudioPageBlocksProps) {
  const displayStudio = toDisplayStudio(studio);

  return (
    <>
      {blocks.map((block) => {
        switch (block.blockId) {
          case "about":
            return <StudioProfile key={block.key} />;

          case "type-tester":
            return <TypeTester key={block.key} />;

          case "typeface-list": {
            const tfData = block.data as
              | TypefaceListBlockData
              | undefined;
            const tfStyle: React.CSSProperties = {};
            if (tfData?.backgroundColor)
              tfStyle.backgroundColor =
                tfData.backgroundColor;
            if (tfData?.fontColor)
              tfStyle.color = tfData.fontColor;
            return (
              <div
                key={block.key}
                style={tfStyle}
              >
                <TypefacesList
                  studio={displayStudio}
                  typefaceMeta={typefaceMeta}
                />
              </div>
            );
          }

          case "fonts-in-use":
            return <FontsInUseList key={block.key} />;

          case "gallery": {
            const galleryData = block.data as
              | GalleryBlockData
              | undefined;
            if (!galleryData) return null;
            return (
              <StudioGallery
                key={block.key}
                data={galleryData}
              />
            );
          }

          case "image": {
            const imageData = block.data as
              | ImageBlockData
              | undefined;
            if (!imageData) return null;
            return (
              <StudioImageBlock
                key={block.key}
                data={imageData}
              />
            );
          }

          case "video": {
            const videoData = block.data as
              | VideoBlockData
              | undefined;
            if (!videoData) return null;
            return (
              <StudioVideoBlock
                key={block.key}
                data={videoData}
              />
            );
          }

          case "spacer": {
            const spacerData = block.data as
              | SpacerBlockData
              | undefined;
            if (!spacerData) return null;
            return (
              <StudioSpacerBlock
                key={block.key}
                data={spacerData}
              />
            );
          }

          case "store": {
            const storeData = block.data as
              | StoreBlockData
              | undefined;
            if (!storeData) return null;
            return (
              <StudioStoreBlock
                key={block.key}
                data={storeData}
              />
            );
          }

          case "blog": {
            const blogData = block.data as
              | BlogBlockData
              | undefined;
            if (!blogData) return null;
            return (
              <StudioBlogBlock
                key={block.key}
                data={blogData}
              />
            );
          }

          default:
            return null;
        }
      })}
    </>
  );
}
