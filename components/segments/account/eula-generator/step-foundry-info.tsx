"use client";

import { InputDropdown } from "@/components/global/inputs";
import { COUNTRY_OPTIONS } from "@/constant/COUNTRY_OPTIONS";
import { useEulaStore } from "@/stores/eula-store";

export default function StepFoundryInfo() {
  const { foundryInfo, updateFoundryInfo } = useEulaStore();

  return (
    <div className="flex w-full flex-col gap-y-6">
      <div>
        <h3 className="font-bold font-ortank text-lg">
          Foundry & Designer Info
        </h3>
        <p className="mt-1 font-whisper text-neutral-500 text-sm">
          Basic information about your type foundry and the
          designer.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Foundry Name */}
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="foundryName"
            className="font-whisper text-sm"
          >
            Foundry / Studio name{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            id="foundryName"
            type="text"
            value={foundryInfo.foundryName}
            onChange={(e) =>
              updateFoundryInfo({
                foundryName: e.target.value,
              })
            }
            placeholder="e.g. Sandoll, AG Typography Institute"
            className="w-full border border-neutral-300 px-5 py-4 font-whisper text-sm placeholder:text-neutral-400"
          />
        </div>

        {/* Designer Name */}
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="designerName"
            className="font-whisper text-sm"
          >
            Designer full name{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            id="designerName"
            type="text"
            value={foundryInfo.designerName}
            onChange={(e) =>
              updateFoundryInfo({
                designerName: e.target.value,
              })
            }
            placeholder="e.g. Kim Jinhyeong"
            className="w-full border border-neutral-300 px-5 py-4 font-whisper text-sm placeholder:text-neutral-400"
          />
        </div>

        {/* Business Registration Number */}
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="businessRegNumber"
            className="font-whisper text-sm"
          >
            Business registration number
            <span className="ml-1 text-neutral-400">
              (optional)
            </span>
          </label>
          <input
            id="businessRegNumber"
            type="text"
            value={
              foundryInfo.businessRegistrationNumber || ""
            }
            onChange={(e) =>
              updateFoundryInfo({
                businessRegistrationNumber: e.target.value,
              })
            }
            placeholder="e.g. 123-45-67890"
            className="w-full border border-neutral-300 px-5 py-4 font-whisper text-sm placeholder:text-neutral-400"
          />
        </div>

        {/* Contact Email */}
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="contactEmail"
            className="font-whisper text-sm"
          >
            Contact email{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            id="contactEmail"
            type="email"
            value={foundryInfo.contactEmail}
            onChange={(e) =>
              updateFoundryInfo({
                contactEmail: e.target.value,
              })
            }
            placeholder="hello@foundry.com"
            className="w-full border border-neutral-300 px-5 py-4 font-whisper text-sm placeholder:text-neutral-400"
          />
        </div>

        {/* Website */}
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="website"
            className="font-whisper text-sm"
          >
            Website{" "}
            <span className="ml-1 text-neutral-400">
              (optional)
            </span>
          </label>
          <input
            id="website"
            type="url"
            value={foundryInfo.website || ""}
            onChange={(e) =>
              updateFoundryInfo({ website: e.target.value })
            }
            placeholder="https://foundry.com"
            className="w-full border border-neutral-300 px-5 py-4 font-whisper text-sm placeholder:text-neutral-400"
          />
        </div>

        {/* Country */}
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="country"
            className="font-whisper text-sm"
          >
            Country of business
          </label>
          <InputDropdown
            value={foundryInfo.country}
            options={COUNTRY_OPTIONS.map((c) => ({
              value: c,
              label: c,
            }))}
            onChange={(value) =>
              updateFoundryInfo({ country: value })
            }
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
