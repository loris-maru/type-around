import type { MemberRole } from "@/types/studio";
import type { CustomSelectOption } from "@/types/components";

export const ROLE_LABELS: Record<MemberRole, string> = {
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
};

export const ROLE_DESCRIPTIONS: Record<MemberRole, string> = {
  owner: "Full access to all settings and billing",
  admin: "Can manage members and all content",
  editor: "Can edit content and typefaces",
};

export const ROLE_OPTIONS: CustomSelectOption[] = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
];
