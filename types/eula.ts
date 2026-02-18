import { z } from "zod";

// Step 1 — Foundry & Designer Info
export const foundryInfoSchema = z.object({
  foundryName: z
    .string()
    .min(1, "Foundry / studio name is required"),
  designerName: z
    .string()
    .min(1, "Designer name is required"),
  businessRegistrationNumber: z.string().optional(),
  contactEmail: z.string().email("Valid email is required"),
  website: z
    .string()
    .url("Valid URL required")
    .optional()
    .or(z.literal("")),
  country: z.string().default("South Korea"),
  logoUrl: z.string().optional(),
});

// Step 2 — Font Product Details
export const fontProductSchema = z.object({
  fontFamilies: z
    .array(z.string())
    .min(1, "At least one font family is required"),
  fontFormats: z
    .array(
      z.enum(["OTF", "TTF", "WOFF", "WOFF2", "Variable"])
    )
    .min(1, "At least one format is required"),
  versionOrDate: z.string().optional(),
});

// Step 3 — License Scope
export const licenseScopeSchema = z.object({
  licenseType: z.enum(["personal", "commercial", "both"]),
  permittedUsers: z.enum(["1", "1-5", "1-10", "unlimited"]),
  permittedUseTypes: z
    .array(
      z.enum([
        "print",
        "digital-static",
        "web-embedding",
        "app-embedding",
        "broadcast-video",
        "logo-trademark",
        "ebook-embedding",
        "game-software-embedding",
      ])
    )
    .min(1, "At least one use type is required"),
  geographicScope: z.enum([
    "worldwide",
    "south-korea",
    "custom",
  ]),
  customGeographicScope: z.string().optional(),
});

// Step 4 — Restrictions & Rights
export const restrictionsSchema = z.object({
  allowSublicensing: z.boolean(),
  allowModification: z.boolean(),
  allowRedistribution: z.boolean(),
  allowAiMlTraining: z.boolean(),
  includeEmbeddingProtection: z.boolean(),
});

// Step 5 — Legal & Output Preferences
export const legalPreferencesSchema = z.object({
  governingLaw: z.enum(["korean", "other"]),
  customGoverningLaw: z.string().optional(),
  disputeResolution: z.enum([
    "korean-courts",
    "arbitration",
  ]),
  outputLanguage: z.enum(["korean", "bilingual"]),
  includeKoreanCopyrightAct: z.boolean().default(true),
});

// Combined schema
export const eulaFormSchema = z.object({
  ...foundryInfoSchema.shape,
  ...fontProductSchema.shape,
  ...licenseScopeSchema.shape,
  ...restrictionsSchema.shape,
  ...legalPreferencesSchema.shape,
});

// Inferred types
export type FoundryInfo = z.infer<typeof foundryInfoSchema>;
export type FontProduct = z.infer<typeof fontProductSchema>;
export type LicenseScope = z.infer<
  typeof licenseScopeSchema
>;
export type Restrictions = z.infer<
  typeof restrictionsSchema
>;
export type LegalPreferences = z.infer<
  typeof legalPreferencesSchema
>;
export type EulaFormData = z.infer<typeof eulaFormSchema>;

// Step configuration
export const EULA_STEPS = [
  {
    id: 1,
    title: "Foundry & Designer Info",
    titleKo: "파운드리 및 디자이너 정보",
  },
  {
    id: 2,
    title: "Font Product Details",
    titleKo: "폰트 제품 정보",
  },
  {
    id: 3,
    title: "License Scope",
    titleKo: "라이선스 범위",
  },
  {
    id: 4,
    title: "Restrictions & Rights",
    titleKo: "제한 및 권리",
  },
  {
    id: 5,
    title: "Legal & Output Preferences",
    titleKo: "법적 사항 및 출력 설정",
  },
] as const;

// Option labels for display
export const FONT_FORMAT_OPTIONS = [
  { value: "OTF", label: "OTF" },
  { value: "TTF", label: "TTF" },
  { value: "WOFF", label: "WOFF" },
  { value: "WOFF2", label: "WOFF2" },
  { value: "Variable", label: "Variable" },
] as const;

export const LICENSE_TYPE_OPTIONS = [
  {
    value: "personal",
    label: "Personal use",
    labelKo: "개인 사용",
  },
  {
    value: "commercial",
    label: "Commercial use",
    labelKo: "상업적 사용",
  },
  { value: "both", label: "Both", labelKo: "둘 다" },
] as const;

export const PERMITTED_USERS_OPTIONS = [
  { value: "1", label: "1 user", labelKo: "1명" },
  { value: "1-5", label: "1–5 users", labelKo: "1–5명" },
  { value: "1-10", label: "1–10 users", labelKo: "1–10명" },
  {
    value: "unlimited",
    label: "Unlimited",
    labelKo: "무제한",
  },
] as const;

export const PERMITTED_USE_TYPE_OPTIONS = [
  {
    value: "print",
    label: "Print media",
    labelKo: "인쇄 매체",
  },
  {
    value: "digital-static",
    label: "Digital design (static)",
    labelKo: "디지털 디자인 (정적)",
  },
  {
    value: "web-embedding",
    label: "Web embedding (webfont)",
    labelKo: "웹 임베딩 (웹폰트)",
  },
  {
    value: "app-embedding",
    label: "App embedding",
    labelKo: "앱 임베딩",
  },
  {
    value: "broadcast-video",
    label: "Broadcast & video",
    labelKo: "방송 및 영상",
  },
  {
    value: "logo-trademark",
    label: "Logo & trademark use",
    labelKo: "로고 및 상표 사용",
  },
  {
    value: "ebook-embedding",
    label: "E-book embedding",
    labelKo: "전자책 임베딩",
  },
  {
    value: "game-software-embedding",
    label: "Game or software embedding",
    labelKo: "게임 또는 소프트웨어 임베딩",
  },
] as const;

export const GEOGRAPHIC_SCOPE_OPTIONS = [
  {
    value: "worldwide",
    label: "Worldwide",
    labelKo: "전세계",
  },
  {
    value: "south-korea",
    label: "South Korea only",
    labelKo: "대한민국만",
  },
  {
    value: "custom",
    label: "Custom",
    labelKo: "사용자 지정",
  },
] as const;

export const DISPUTE_RESOLUTION_OPTIONS = [
  {
    value: "korean-courts",
    label: "Korean courts",
    labelKo: "한국 법원",
  },
  {
    value: "arbitration",
    label: "Arbitration",
    labelKo: "중재",
  },
] as const;

export const OUTPUT_LANGUAGE_OPTIONS = [
  {
    value: "korean",
    label: "Korean only",
    labelKo: "한국어만",
  },
  {
    value: "bilingual",
    label: "Bilingual (Korean + English)",
    labelKo: "이중 언어 (한국어 + 영어)",
  },
] as const;
