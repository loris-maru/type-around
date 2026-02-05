import DesignersInput from "./designers-input";
import { FormField } from "@/types/forms";

const FORM_FIELDS: FormField[] = [
  {
    label: "Name",
    slug: "name",
    type: "text",
    placeholder: "Enter your name...",
  },
  {
    label: "Location",
    slug: "location",
    type: "text",
    placeholder: "Enter your location...",
  },
  {
    label: "Founded in",
    slug: "foundedIn",
    type: "number",
    placeholder: "Enter your founded year...",
  },
  {
    label: "Contact email",
    slug: "email",
    type: "email",
    placeholder: "Enter your contact email...",
  },
  {
    label: "Designers",
    slug: "designers",
    type: "custom",
    placeholder: "",
    customComponent: DesignersInput,
  },
  {
    label: "Website",
    slug: "website",
    type: "url",
    placeholder: "Enter your website...",
  },
];

export default FORM_FIELDS;
