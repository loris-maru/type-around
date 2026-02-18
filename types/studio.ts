import { z } from "zod";
import type { LayoutItem } from "./layout";

// Zod Schemas
export const DesignerSocialMediaSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Must be a valid URL"),
});
export type DesignerSocialMedia = z.infer<
  typeof DesignerSocialMediaSchema
>;

export const DesignerSchema = z.object({
  id: z.string().optional().default(""),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email().or(z.literal("")).default(""),
  biography: z.string().default(""),
  avatar: z.string().default(""),
  website: z.string().url().or(z.literal("")).default(""),
  socialMedia: z
    .array(DesignerSocialMediaSchema)
    .default([]),
});

// Studio member roles
export const MemberRoleEnum = z.enum([
  "owner",
  "admin",
  "editor",
]);
export type MemberRole = z.infer<typeof MemberRoleEnum>;

// Studio member schema (Clerk users with access to the studio)
export const StudioMemberSchema = z.object({
  id: z.string(), // Clerk user ID
  email: z.string().email(),
  firstName: z.string().default(""),
  lastName: z.string().default(""),
  imageUrl: z.string().default(""),
  role: MemberRoleEnum.default("editor"),
  addedAt: z.string(), // ISO date string
});
export type StudioMember = z.infer<
  typeof StudioMemberSchema
>;

export const SocialMediaSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Must be a valid URL"),
});

export const GradientSchema = z.object({
  from: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Must be a valid hex color"
    ),
  to: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Must be a valid hex color"
    ),
});

export const FontSchema = z.object({
  id: z.string(),
  styleName: z.string(),
  weight: z.number(),
  width: z.number().default(100),
  isItalic: z.boolean().default(false),
  printPrice: z.number().min(0).default(0),
  webPrice: z.number().min(0).default(0),
  file: z.string().default(""), // Type tester file (woff2)
  salesFiles: z.array(z.string()).default([]), // Files for purchase (woff2, woff, ttf, otf)
  // Legacy fields for backwards compatibility
  price: z.number().min(0).optional(),
  text: z.string().optional(),
  fullName: z.string().optional(),
  name: z.string().optional(),
  style: z.string().optional(),
});

export const TypefaceStatusEnum = z.enum([
  "in progress",
  "complete",
]);
export type TypefaceStatus = z.infer<
  typeof TypefaceStatusEnum
>;

export const StudioTypefaceSchema = z.object({
  id: z.string(),
  category: z.array(z.string()),
  name: z.string().min(1, "Name is required"),
  hangeulName: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  description: z.string(),
  icon: z.string(),
  fonts: z.array(FontSchema),
  characters: z.number().int().min(0),
  releaseDate: z.string(),
  studio: z.string(),
  gradient: z.string().optional(),
  status: TypefaceStatusEnum.default("in progress"),
  published: z.boolean().default(false),
  // Designer IDs (references to studio.designers[].id)
  designerIds: z.array(z.string()).default([]),
  fontLineText: z.string().default(""),
  // Font used for display in studio page typeface list
  displayFontId: z.string().default(""),
  // New fields
  supportedLanguages: z.array(z.string()).default([]),
  headerImage: z.string().default(""),
  heroLetter: z.string().default(""),
  specimen: z.string().default(""),
  eula: z.string().default(""),
  variableFontFile: z.string().default(""),
  galleryImages: z.array(z.string()).default([]),
  // Typeface vision (for search & discovery)
  visionUsage: z.string().default(""),
  visionContrast: z.string().default(""),
  visionWidth: z.string().default(""),
  visionPlayful: z.string().default(""),
  visionFrame: z.string().default(""),
  visionSerif: z.string().default(""),
});

export const SpecimenPageSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
});
export type SpecimenPage = z.infer<
  typeof SpecimenPageSchema
>;

export const StudioSpecimenSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  typefaceSlug: z.string(),
  createdAt: z.string(), // ISO date string
  format: z.enum(["A4", "Letter"]).default("A4"),
  orientation: z
    .enum(["portrait", "landscape"])
    .default("portrait"),
  pages: z.array(SpecimenPageSchema).default([]),
});
export type StudioSpecimen = z.infer<
  typeof StudioSpecimenSchema
>;

export const FontInUseSchema = z.object({
  id: z.string(),
  images: z
    .array(z.string())
    .min(1, "At least one image is required"),
  projectName: z
    .string()
    .min(1, "Project name is required"),
  designerName: z
    .string()
    .min(1, "Designer name is required"),
  typefaceId: z.string().min(1, "Typeface is required"),
  typefaceName: z.string().default(""),
  description: z.string().default(""),
});

export const StudioSchema = z.object({
  id: z.string().min(1, "ID is required"),
  ownerEmail: z.string().email("Must be a valid email"),
  name: z.string().min(1, "Studio name is required"),
  hangeulName: z.string().default(""),
  location: z.string(),
  foundedIn: z.string(),
  contactEmail: z
    .string()
    .email("Must be a valid email")
    .or(z.literal("")),
  designers: z.array(DesignerSchema),
  website: z
    .string()
    .url("Must be a valid URL")
    .or(z.literal("")),
  description: z.string().default(""),
  thumbnail: z.string().default(""),
  avatar: z.string().default(""),
  socialMedia: z.array(SocialMediaSchema),
  headerFont: z.string(),
  textFont: z.string().default(""),
  heroCharacter: z.string().default(""),
  gradient: GradientSchema,
  pageLayout: z
    .array(
      z.object({
        blockId: z.string(),
        key: z.string(),
        data: z.any().optional(),
      })
    )
    .default([]),
  typefaces: z.array(StudioTypefaceSchema),
  specimens: z.array(StudioSpecimenSchema).default([]),
  fontsInUse: z.array(FontInUseSchema).default([]),
  // Stripe Connect
  stripeAccountId: z.string().optional().default(""),
  // Team members with access to the studio
  members: z.array(StudioMemberSchema).default([]),
});

// Inferred Types from Zod schemas
export type Designer = z.infer<typeof DesignerSchema>;
export type SocialMedia = z.infer<typeof SocialMediaSchema>;
export type Gradient = z.infer<typeof GradientSchema>;
export type Font = z.infer<typeof FontSchema>;
export type StudioTypeface = z.infer<
  typeof StudioTypefaceSchema
>;
export type FontInUse = z.infer<typeof FontInUseSchema>;
export type Studio = z.infer<typeof StudioSchema>;

// Schema for creating a new studio (without id)
export const CreateStudioSchema = StudioSchema.omit({
  id: true,
});
export type CreateStudio = z.infer<
  typeof CreateStudioSchema
>;

// Schema for updating studio information
export const UpdateStudioInfoSchema = z.object({
  name: z.string().min(1).optional(),
  hangeulName: z.string().optional(),
  location: z.string().optional(),
  foundedIn: z.string().optional(),
  contactEmail: z
    .string()
    .email()
    .or(z.literal(""))
    .optional(),
  description: z.string().optional(),
  designers: z
    .array(
      DesignerSchema.partial().extend({
        firstName: z
          .string()
          .min(1, "First name is required"),
        lastName: z
          .string()
          .min(1, "Last name is required"),
      })
    )
    .optional(),
  website: z.string().url().or(z.literal("")).optional(),
  thumbnail: z.string().optional(),
  avatar: z.string().optional(),
});
export type UpdateStudioInfo = z.infer<
  typeof UpdateStudioInfoSchema
>;

// Schema for updating studio page design
export const UpdateStudioPageSchema = z.object({
  headerFont: z.string().optional(),
  textFont: z.string().optional(),
  heroCharacter: z.string().optional(),
  gradient: GradientSchema.optional(),
  pageLayout: z
    .array(
      z.object({
        blockId: z.string(),
        key: z.string(),
        data: z.any().optional(),
      })
    )
    .optional(),
});
export type UpdateStudioPage = z.infer<
  typeof UpdateStudioPageSchema
>;

// ===========================================
// Studio Context Types
// ===========================================

export type StudioContextValue = {
  studio: Studio | null;
  isLoading: boolean;
  error: Error | null;
  updateInformation: (data: {
    name?: string;
    hangeulName?: string;
    location?: string;
    foundedIn?: string;
    contactEmail?: string;
    description?: string;
    designers?: {
      id?: string;
      firstName: string;
      lastName: string;
      email?: string;
      biography?: string;
      avatar?: string;
      website?: string;
      socialMedia?: { name: string; url: string }[];
    }[];
    website?: string;
    thumbnail?: string;
    avatar?: string;
  }) => Promise<void>;
  updateSocialMedia: (
    socialMedia: SocialMedia[]
  ) => Promise<void>;
  updateStudioPageSettings: (data: {
    headerFont?: string;
    textFont?: string;
    heroCharacter?: string;
    gradient?: { from: string; to: string };
    pageLayout?: LayoutItem[];
  }) => Promise<void>;
  addTypeface: (typeface: StudioTypeface) => Promise<void>;
  removeTypeface: (typefaceId: string) => Promise<void>;
  updateTypeface: (
    typefaceId: string,
    updates: Partial<StudioTypeface>
  ) => Promise<void>;
  addSpecimen: (specimen: StudioSpecimen) => Promise<void>;
  updateSpecimen: (
    specimenId: string,
    updates: Partial<
      Pick<
        StudioSpecimen,
        "name" | "format" | "orientation" | "pages"
      >
    >
  ) => Promise<void>;
  updateStudio: (
    data: Partial<Omit<Studio, "id" | "ownerEmail">>
  ) => Promise<void>;
};

// Default values for creating a new studio
import { DEFAULT_PAGE_LAYOUT } from "@/constant/DEFAULT_PAGE_LAYOUT";

export const DEFAULT_STUDIO: Omit<
  Studio,
  "id" | "ownerEmail"
> = {
  name: "",
  hangeulName: "",
  location: "",
  foundedIn: "",
  contactEmail: "",
  designers: [],
  website: "",
  description: "",
  thumbnail: "",
  avatar: "",
  socialMedia: [],
  headerFont: "",
  textFont: "",
  heroCharacter: "",
  gradient: {
    from: "#FFF8E8",
    to: "#F2F2F2",
  },
  pageLayout: DEFAULT_PAGE_LAYOUT,
  typefaces: [],
  specimens: [],
  fontsInUse: [],
  stripeAccountId: "",
  members: [],
};
