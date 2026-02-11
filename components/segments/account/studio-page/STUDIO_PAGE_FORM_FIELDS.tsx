import type { FormField } from "@/types/forms";
import FontUploadInput from "./font-upload-input";
import GradientColorInput from "./gradient-color-input";

function DisplayFontInput() {
  return (
    <FontUploadInput
      field="headerFont"
      label="Display font"
    />
  );
}

function TextFontInput() {
  return (
    <FontUploadInput
      field="textFont"
      label="Text font"
    />
  );
}

const STUDIO_PAGE_FORM_FIELDS: FormField[] = [
  {
    label: "Display font",
    slug: "headerFont",
    type: "custom",
    placeholder: "",
    customComponent: DisplayFontInput,
  },
  {
    label: "Text font",
    slug: "textFont",
    type: "custom",
    placeholder: "",
    customComponent: TextFontInput,
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
