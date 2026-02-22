"use client";

import { useMemo } from "react";
import type {
  BlogBlockData,
  GalleryBlockData,
  ImageBlockData,
  SpacerBlockData,
  StoreBlockData,
  TypefaceListBlockData,
  VideoBlockData,
} from "@/types/layout";
import type { StudioPageBlocksProps } from "@/types/studio-page-blocks";
import type { TypetesterTypeface } from "@/types/typetester";
import AboutBlock from "./about-block";
import BlogBlock from "./blog-block";
import FontsInUseBlock from "./fonts-in-use-block";
import GalleryBlock from "./gallery-block";
import ImageBlock from "./image-block";
import SpacerBlock from "./spacer-block";
import StoreBlock from "./store-block";
import { toDisplayStudio } from "./to-display-studio";
import TypeTesterBlock from "./type-tester-block";
import TypefaceListBlock from "./typeface-list-block";
import VideoBlock from "./video-block";

export default function StudioPageBlocks({
  blocks,
  studio,
  typefaceMeta,
}: StudioPageBlocksProps) {
  const displayStudio = useMemo(
    () => toDisplayStudio(studio),
    [studio]
  );

  const typetesterTypefaces: TypetesterTypeface[] =
    useMemo(() => {
      return studio.typefaces
        .filter((tf) => tf.published)
        .map((tf) => ({
          id: tf.id,
          name: tf.name,
          fonts: tf.fonts
            .filter((f) => f.file)
            .map((f) => ({
              id: f.id,
              styleName: f.styleName,
              weight: f.weight,
              isItalic: f.isItalic,
              file: f.file,
            })),
        }))
        .filter((tf) => tf.fonts.length > 0);
    }, [studio.typefaces]);

  return (
    <>
      {blocks.map((block) => {
        switch (block.blockId) {
          case "about":
            return (
              <AboutBlock
                key={block.key}
                studio={studio}
              />
            );

          case "type-tester":
            return (
              <TypeTesterBlock
                key={block.key}
                typefaces={typetesterTypefaces}
              />
            );

          case "typeface-list": {
            const tfData = block.data as
              | TypefaceListBlockData
              | undefined;
            return (
              <TypefaceListBlock
                key={block.key}
                displayStudio={displayStudio}
                typefaceMeta={typefaceMeta}
                data={tfData}
              />
            );
          }

          case "fonts-in-use":
            return <FontsInUseBlock key={block.key} />;

          case "gallery": {
            const galleryData = block.data as
              | GalleryBlockData
              | undefined;
            return (
              <GalleryBlock
                key={block.key}
                data={galleryData}
              />
            );
          }

          case "image": {
            const imageData = block.data as
              | ImageBlockData
              | undefined;
            return (
              <ImageBlock
                key={block.key}
                data={imageData}
              />
            );
          }

          case "video": {
            const videoData = block.data as
              | VideoBlockData
              | undefined;
            return (
              <VideoBlock
                key={block.key}
                data={videoData}
              />
            );
          }

          case "spacer": {
            const spacerData = block.data as
              | SpacerBlockData
              | undefined;
            return (
              <SpacerBlock
                key={block.key}
                data={spacerData}
              />
            );
          }

          case "store": {
            const storeData = block.data as
              | StoreBlockData
              | undefined;
            return (
              <StoreBlock
                key={block.key}
                data={storeData}
              />
            );
          }

          case "blog": {
            const blogData = block.data as
              | BlogBlockData
              | undefined;
            return (
              <BlogBlock
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
