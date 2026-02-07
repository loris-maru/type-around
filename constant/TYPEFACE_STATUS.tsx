import {
  RiDonutChartLine,
  RiEyeFill,
} from "react-icons/ri";
import type { CustomSelectOption } from "@/types/components";

export const TYPEFACE_STATUS_OPTIONS: CustomSelectOption[] =
  [
    {
      value: "draft",
      label: "Draft",
      icon: (
        <RiDonutChartLine className="w-4 h-4 text-black" />
      ),
    },
    {
      value: "published",
      label: "Published",
      icon: (
        <RiEyeFill className="w-4 h-4 text-green-500" />
      ),
    },
  ];
