import IconInstagram from "@/components/icons/icon-instagram";
import IconTwitter from "@/components/icons/icon-twitter";
import IconLinkedin from "@/components/icons/icon-linkedin";
import IconBehance from "@/components/icons/icon-behance";
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

export default function AccountInformationSocial() {
  return (
    <div className="relative w-full flex flex-col gap-y-4">
      <h1 className="text-xl font-ortank font-bold">
        Social Media
      </h1>
      <form className="grid grid-cols-2 gap-6">
        {FORM_FIELDS.map((field) => {
          const Icon = field.icon;
          return (
            <div
              key={field.slug}
              className="relative w-full"
            >
              <label
                htmlFor={field.slug}
                className="text-base font-normal text-neutral-500 mb-2"
              >
                {field.label}
              </label>
              <div className="relative w-full">
                {Icon && (
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                )}
                <input
                  type={field.type}
                  id={field.slug}
                  name={field.slug}
                  placeholder={field.placeholder}
                  className="w-full pl-12 pr-6 py-5 border border-neutral-300 placeholder:text-black placeholder:text-base placeholder:font-whisper placeholder:font-medium"
                />
              </div>
            </div>
          );
        })}
      </form>
    </div>
  );
}
