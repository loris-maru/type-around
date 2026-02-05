import { z } from "zod";

// Zod Schemas
export const DesignerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

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
  file: z.string().default(""),
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
  // New fields
  supportedLanguages: z.array(z.string()).default([]),
  headerImage: z.string().default(""),
  specimen: z.string().default(""),
  eula: z.string().default(""),
  variableFontFile: z.string().default(""),
});

export const StudioSchema = z.object({
  id: z.string().min(1, "ID is required"),
  ownerEmail: z.string().email("Must be a valid email"),
  name: z.string().min(1, "Studio name is required"),
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
  socialMedia: z.array(SocialMediaSchema),
  headerFont: z.string(),
  gradient: GradientSchema,
  typefaces: z.array(StudioTypefaceSchema),
});

// Inferred Types from Zod schemas
export type Designer = z.infer<typeof DesignerSchema>;
export type SocialMedia = z.infer<typeof SocialMediaSchema>;
export type Gradient = z.infer<typeof GradientSchema>;
export type Font = z.infer<typeof FontSchema>;
export type StudioTypeface = z.infer<
  typeof StudioTypefaceSchema
>;
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
  location: z.string().optional(),
  foundedIn: z.string().optional(),
  contactEmail: z
    .string()
    .email()
    .or(z.literal(""))
    .optional(),
  designers: z.array(DesignerSchema).optional(),
  website: z.string().url().or(z.literal("")).optional(),
});
export type UpdateStudioInfo = z.infer<
  typeof UpdateStudioInfoSchema
>;

// Schema for updating studio page design
export const UpdateStudioPageSchema = z.object({
  headerFont: z.string().optional(),
  gradient: GradientSchema.optional(),
});
export type UpdateStudioPage = z.infer<
  typeof UpdateStudioPageSchema
>;

// Default values for creating a new studio
export const DEFAULT_STUDIO: Omit<
  Studio,
  "id" | "ownerEmail"
> = {
  name: "",
  location: "",
  foundedIn: "",
  contactEmail: "",
  designers: [],
  website: "",
  socialMedia: [],
  headerFont: "",
  gradient: {
    from: "#FFF8E8",
    to: "#F2F2F2",
  },
  typefaces: [],
};
