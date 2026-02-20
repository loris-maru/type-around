"use client";

import InputText from "@/components/global/inputs/input-text";
import type { FormInputProps } from "@/types/components";

export default function InputTime(
  props: Omit<FormInputProps, "type">
) {
  return (
    <InputText
      {...props}
      type="time"
    />
  );
}
