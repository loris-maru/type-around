"use client";

import StudioProfile from "@/components/segments/studio/profile";
import TypeTester from "@/components/segments/type-tester";
import TypefacesList from "@/components/segments/studio/typefaces-list";
import FontsInUseList from "@/components/segments/studio/fonts-in-use-list";
import StudioGallery from "@/components/segments/studio/gallery";
import StudioImageBlock from "@/components/segments/studio/image-block";
import StudioVideoBlock from "@/components/segments/studio/video-block";
import StudioSpacerBlock from "@/components/segments/studio/spacer-block";
import StudioStoreBlock from "@/components/segments/studio/store-block";
import StudioBlogBlock from "@/components/segments/studio/blog-block";
import type { PreviewBlockRendererProps } from "@/types/components";
import type {
  BlogBlockData,
  GalleryBlockData,
  ImageBlockData,
  SpacerBlockData,
  StoreBlockData,
  TypefaceListBlockData,
  VideoBlockData,
} from "@/types/layout";
import type { Studio } from "@/types/studio";
import type { Studio as MockStudio } from "@/types/typefaces";

function toMockStudio(studio: Studio): MockStudio {
  return {
    id: studio.id,
    name: studio.name,
    description: "",
    image: studio.thumbnail,
    website: studio.website,
    email: studio.contactEmail,
    imageCover: "",
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
      icon: tf.icon,
      fonts: tf.fonts.map((f) => ({
        price: f.price || f.printPrice || 0,
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

export default function PreviewBlockRenderer({
  block,
  studio,
}: PreviewBlockRendererProps) {
  switch (block.blockId) {
    case "about":
      return <StudioProfile />;

    case "type-tester":
      return <TypeTester />;

    case "typeface-list": {
      const tfData = block.data as
        | TypefaceListBlockData
        | undefined;
      const tfStyle: React.CSSProperties = {};
      if (tfData?.backgroundColor)
        tfStyle.backgroundColor = tfData.backgroundColor;
      if (tfData?.fontColor)
        tfStyle.color = tfData.fontColor;
      return (
        <div style={tfStyle}>
          <h3
            className="text-2xl font-ortank font-bold px-10 pt-12"
            style={
              tfData?.fontColor
                ? { color: tfData.fontColor }
                : undefined
            }
          >
            Our typefaces
          </h3>
          <TypefacesList studio={toMockStudio(studio)} />
        </div>
      );
    }

    case "fonts-in-use":
      return <FontsInUseList />;

    case "gallery": {
      const galleryData = block.data as
        | GalleryBlockData
        | undefined;
      if (!galleryData) return null;
      return <StudioGallery data={galleryData} />;
    }

    case "image": {
      const imageData = block.data as
        | ImageBlockData
        | undefined;
      if (!imageData) return null;
      return <StudioImageBlock data={imageData} />;
    }

    case "video": {
      const videoData = block.data as
        | VideoBlockData
        | undefined;
      if (!videoData) return null;
      return <StudioVideoBlock data={videoData} />;
    }

    case "spacer": {
      const spacerData = block.data as
        | SpacerBlockData
        | undefined;
      if (!spacerData) return null;
      return <StudioSpacerBlock data={spacerData} />;
    }

    case "store": {
      const storeData = block.data as
        | StoreBlockData
        | undefined;
      if (!storeData) return null;
      return <StudioStoreBlock data={storeData} />;
    }

    case "blog": {
      const blogData = block.data as
        | BlogBlockData
        | undefined;
      if (!blogData) return null;
      return <StudioBlogBlock data={blogData} />;
    }

    default:
      return null;
  }
}
