import { FormField } from "@/types/forms";
import HeaderFontInput from "./header-font-input";
import GradientColorInput from "./gradient-color-input";

const STUDIO_PAGE_FORM_FIELDS: FormField[] = [
  {
    label: "Header Font",
    slug: "headerFont",
    type: "custom",
    placeholder: "",
    customComponent: HeaderFontInput,
  },
  {
    label: "Gradient Color",
    slug: "gradientColor",
    type: "custom",
    placeholder: "",
    customComponent: GradientColorInput,
  },
];

export default STUDIO_PAGE_FORM_FIELDS;
