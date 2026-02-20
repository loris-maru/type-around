"use client";

import InputText from "@/components/global/inputs/input-text";
import type { FormInputProps } from "@/types/components";

export default function InputDate(
  props: Omit<FormInputProps, "type">
) {
  return (
    <InputText
      {...props}
      type="date"
    />
  );
}
