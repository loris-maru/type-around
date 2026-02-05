import IconBehance from "@/components/icons/icon-behance";
import IconInstagram from "@/components/icons/icon-instagram";
import IconLinkedin from "@/components/icons/icon-linkedin";
import IconTwitter from "@/components/icons/icon-twitter";
import { FormField } from "@/types/forms";

const FORM_FIELDS: FormField[] = [
  {
    label: "Instagram",
    slug: "instagram",
    type: "text",
    placeholder: "Enter your Instagram username...",
    icon: IconInstagram,
  },
  {
    label: "Twitter",
    slug: "x",
    type: "text",
    placeholder: "Enter your Twitter username...",
    icon: IconTwitter,
  },
  {
    label: "LinkedIn",
    slug: "linkedin",
    type: "text",
    placeholder: "Enter your LinkedIn username...",
    icon: IconLinkedin,
  },
  {
    label: "Behance",
    slug: "behance",
    type: "text",
    placeholder: "Enter your Behance username...",
    icon: IconBehance,
  },
];

export default FORM_FIELDS;
