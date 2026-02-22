"use client";

import type {
  GalleryBlockData,
  ImageBlockData,
  StoreBlockData,
  VideoBlockData,
} from "@/types/layout";
import type { CharacterSetBlockData } from "@/types/layout-typeface";
import type { TypefacePageBlocksProps } from "@/types/typeface-page-blocks";
import AboutBlock from "./about-block";
import CharacterSetBlock from "./character-set-block";
import DownloadBlock from "./download-block";
import GalleryBlock from "./gallery-block";
import GoodiesShopBlock from "./goodies-shop-block";
import ImageBlock from "./image-block";
import ShopBlock from "./shop-block";
import TypeTesterBlock from "./type-tester-block";
import UpdatesBlock from "./updates-block";
import VideoBlock from "./video-block";

export default function TypefacePageBlocks({
  blocks,
  rawTypeface,
  typefaceName,
  typefaceSlug,
  studioId,
  studioSlug,
  typetesterFonts,
  typefaceFonts,
}: TypefacePageBlocksProps) {
  const galleryImages = (
    rawTypeface.galleryImages || []
  ).map((src, i) => ({
    src,
    alt: `Gallery image ${i + 1}`,
  }));

  return (
    <>
      {blocks.map((block) => {
        switch (block.blockId) {
          case "type-tester":
            return (
              <TypeTesterBlock
                key={block.key}
                typetesterFonts={typetesterFonts}
              />
            );

          case "about":
            return (
              <AboutBlock
                key={block.key}
                rawTypeface={rawTypeface}
              />
            );

          case "download":
            return (
              <DownloadBlock
                key={block.key}
                rawTypeface={rawTypeface}
                typefaceName={typefaceName}
              />
            );

          case "updates":
            return <UpdatesBlock key={block.key} />;

          case "shop":
            return (
              <ShopBlock
                key={block.key}
                typefaceFonts={typefaceFonts}
                typefaceName={typefaceName}
                typefaceSlug={typefaceSlug}
                studioId={studioId}
                studioSlug={studioSlug}
              />
            );

          case "goodies-shop": {
            const storeData = block.data as
              | StoreBlockData
              | undefined;
            return (
              <GoodiesShopBlock
                key={block.key}
                data={storeData}
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

          case "gallery": {
            const galleryData = block.data as
              | GalleryBlockData
              | undefined;
            return (
              <GalleryBlock
                key={block.key}
                galleryData={galleryData}
                galleryImages={galleryImages}
              />
            );
          }

          case "character-set": {
            const charData = block.data as
              | CharacterSetBlockData
              | undefined;
            return (
              <CharacterSetBlock
                key={block.key}
                data={charData}
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
