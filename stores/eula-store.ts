import { create } from "zustand";
import type {
  FoundryInfo,
  FontProduct,
  LicenseScope,
  Restrictions,
  LegalPreferences,
} from "@/types/eula";

type EulaState = {
  currentStep: number;
  foundryInfo: FoundryInfo;
  fontProduct: FontProduct;
  licenseScope: LicenseScope;
  restrictions: Restrictions;
  legalPreferences: LegalPreferences;
  generatedEula: string;
  isGenerating: boolean;
  generationError: string | null;
};

type EulaActions = {
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFoundryInfo: (data: Partial<FoundryInfo>) => void;
  updateFontProduct: (data: Partial<FontProduct>) => void;
  updateLicenseScope: (data: Partial<LicenseScope>) => void;
  updateRestrictions: (data: Partial<Restrictions>) => void;
  updateLegalPreferences: (
    data: Partial<LegalPreferences>
  ) => void;
  setGeneratedEula: (eula: string) => void;
  appendToEula: (chunk: string) => void;
  setIsGenerating: (generating: boolean) => void;
  setGenerationError: (error: string | null) => void;
  reset: () => void;
};

const initialFoundryInfo: FoundryInfo = {
  foundryName: "",
  designerName: "",
  businessRegistrationNumber: "",
  contactEmail: "",
  website: "",
  country: "South Korea",
  logoUrl: "",
};

const initialFontProduct: FontProduct = {
  fontFamilies: [],
  fontFormats: [],
  versionOrDate: "",
};

const initialLicenseScope: LicenseScope = {
  licenseType: "both",
  permittedUsers: "1",
  permittedUseTypes: [],
  geographicScope: "worldwide",
  customGeographicScope: "",
};

const initialRestrictions: Restrictions = {
  allowSublicensing: false,
  allowModification: false,
  allowRedistribution: false,
  allowAiMlTraining: false,
  includeEmbeddingProtection: true,
};

const initialLegalPreferences: LegalPreferences = {
  governingLaw: "korean",
  customGoverningLaw: "",
  disputeResolution: "korean-courts",
  outputLanguage: "korean",
  includeKoreanCopyrightAct: true,
};

export const useEulaStore = create<EulaState & EulaActions>(
  (set) => ({
    currentStep: 1,
    foundryInfo: initialFoundryInfo,
    fontProduct: initialFontProduct,
    licenseScope: initialLicenseScope,
    restrictions: initialRestrictions,
    legalPreferences: initialLegalPreferences,
    generatedEula: "",
    isGenerating: false,
    generationError: null,

    setStep: (step) => set({ currentStep: step }),
    nextStep: () =>
      set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 5),
      })),
    prevStep: () =>
      set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1),
      })),

    updateFoundryInfo: (data) =>
      set((state) => ({
        foundryInfo: { ...state.foundryInfo, ...data },
      })),
    updateFontProduct: (data) =>
      set((state) => ({
        fontProduct: { ...state.fontProduct, ...data },
      })),
    updateLicenseScope: (data) =>
      set((state) => ({
        licenseScope: { ...state.licenseScope, ...data },
      })),
    updateRestrictions: (data) =>
      set((state) => ({
        restrictions: { ...state.restrictions, ...data },
      })),
    updateLegalPreferences: (data) =>
      set((state) => ({
        legalPreferences: {
          ...state.legalPreferences,
          ...data,
        },
      })),

    setGeneratedEula: (eula) =>
      set({ generatedEula: eula }),
    appendToEula: (chunk) =>
      set((state) => ({
        generatedEula: state.generatedEula + chunk,
      })),
    setIsGenerating: (generating) =>
      set({ isGenerating: generating }),
    setGenerationError: (error) =>
      set({ generationError: error }),

    reset: () =>
      set({
        currentStep: 1,
        foundryInfo: initialFoundryInfo,
        fontProduct: initialFontProduct,
        licenseScope: initialLicenseScope,
        restrictions: initialRestrictions,
        legalPreferences: initialLegalPreferences,
        generatedEula: "",
        isGenerating: false,
        generationError: null,
      }),
  })
);
