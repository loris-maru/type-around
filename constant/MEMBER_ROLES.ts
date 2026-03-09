import type { MemberRole } from "@/types/studio";
import type { CustomSelectOption } from "@/types/components";

export const ROLE_LABELS: Record<MemberRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
  editor: "Member", // legacy, maps to member
};

export const ROLE_DESCRIPTIONS: Record<MemberRole, string> =
  {
    owner: "Full access to all settings and billing",
    admin: "Can manage members and all content",
    member: "Can edit content and typefaces",
    editor: "Can edit content and typefaces", // legacy
  };

export const ROLE_OPTIONS: CustomSelectOption[] = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
];
