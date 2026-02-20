"use client";

import InputText from "@/components/global/inputs/input-text";
import type { FormInputProps } from "@/types/components";

export default function InputEmail(
  props: Omit<FormInputProps, "type">
) {
  return (
    <InputText
      {...props}
      type="email"
    />
  );
}
