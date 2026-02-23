import type {
  FontProduct,
  FoundryInfo,
  LegalPreferences,
  LicenseScope,
  Restrictions,
} from "./eula";

export type ModalStore = {
  openCount: number;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export type EulaState = {
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

export type EulaActions = {
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
