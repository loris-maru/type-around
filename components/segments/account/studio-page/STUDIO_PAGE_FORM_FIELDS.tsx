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
    colSpan: 1,
  },
  {
    label: "Text font",
    slug: "textFont",
    type: "custom",
    placeholder: "",
    customComponent: TextFontInput,
    colSpan: 1,
  },
  {
    label: "Gradient Color",
    slug: "gradient",
    type: "custom",
    placeholder: "",
    customComponent: GradientColorInput,
    colSpan: 1,
  },
];

export default STUDIO_PAGE_FORM_FIELDS;
