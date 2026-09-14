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
    <div className="relative flex w-full flex-col gap-y-8">
      <h2 className="swiss-h2">Social media</h2>
      <form className="grid grid-cols-2 gap-x-12 gap-y-8">
        {FORM_FIELDS.map((field) => {
          const Icon = field.icon;
          return (
            <div
              key={field.slug}
              className="relative w-full"
            >
              <label
                htmlFor={field.slug}
                className="swiss-label mb-2 block text-neutral-500"
              >
                {field.label}
              </label>
              <div className="relative w-full">
                {Icon && (
                  <Icon className="absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2 text-swiss-ink" />
                )}
                <input
                  type={field.type}
                  id={field.slug}
                  name={field.slug}
                  placeholder={field.placeholder}
                  className="swiss-field pl-8"
                />
              </div>
            </div>
          );
        })}
      </form>
    </div>
  );
}
