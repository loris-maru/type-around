"use client";

import { useEulaStore } from "@/stores/eula-store";
import {
  LICENSE_TYPE_OPTIONS,
  PERMITTED_USERS_OPTIONS,
  PERMITTED_USE_TYPE_OPTIONS,
  GEOGRAPHIC_SCOPE_OPTIONS,
} from "@/types/eula";
import type { LicenseScope } from "@/types/eula";

export default function StepLicenseScope() {
  const { licenseScope, updateLicenseScope } =
    useEulaStore();

  const toggleUseType = (
    value: LicenseScope["permittedUseTypes"][number]
  ) => {
    const current = licenseScope.permittedUseTypes;
    if (current.includes(value)) {
      updateLicenseScope({
        permittedUseTypes: current.filter(
          (v) => v !== value
        ),
      });
    } else {
      updateLicenseScope({
        permittedUseTypes: [...current, value],
      });
    }
  };

  return (
    <div className="flex w-full flex-col gap-y-6">
      <div>
        <h3 className="font-bold font-ortank text-lg">
          License Scope
        </h3>
        <p className="mt-1 font-whisper text-neutral-500 text-sm">
          Define what the licensee is allowed to do with
          your font.
        </p>
      </div>

      <div className="flex flex-col gap-y-8">
        {/* License Type */}
        <div className="flex flex-col gap-y-3">
          <span className="font-whisper text-sm font-medium">
            License type
          </span>
          <div className="flex gap-3">
            {LICENSE_TYPE_OPTIONS.map(
              ({ value, label, labelKo }) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-2 border px-5 py-3 font-whisper text-sm transition-all duration-200 ${
                    licenseScope.licenseType === value
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 bg-white hover:border-black"
                  }`}
                >
                  <input
                    type="radio"
                    name="licenseType"
                    value={value}
                    checked={
                      licenseScope.licenseType === value
                    }
                    onChange={() =>
                      updateLicenseScope({
                        licenseType:
                          value as LicenseScope["licenseType"],
                      })
                    }
                    className="sr-only"
                  />
                  {label}
                  <span className="text-xs opacity-60">
                    ({labelKo})
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Permitted Users */}
        <div className="flex flex-col gap-y-3">
          <span className="font-whisper text-sm font-medium">
            Number of permitted users/seats
          </span>
          <div className="flex gap-3">
            {PERMITTED_USERS_OPTIONS.map(
              ({ value, label }) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-2 border px-5 py-3 font-whisper text-sm transition-all duration-200 ${
                    licenseScope.permittedUsers === value
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 bg-white hover:border-black"
                  }`}
                >
                  <input
                    type="radio"
                    name="permittedUsers"
                    value={value}
                    checked={
                      licenseScope.permittedUsers === value
                    }
                    onChange={() =>
                      updateLicenseScope({
                        permittedUsers:
                          value as LicenseScope["permittedUsers"],
                      })
                    }
                    className="sr-only"
                  />
                  {label}
                </label>
              )
            )}
          </div>
        </div>

        {/* Permitted Use Types */}
        <div className="flex flex-col gap-y-3">
          <span className="font-whisper text-sm font-medium">
            Permitted use types{" "}
            <span className="text-red-500">*</span>
          </span>
          <div className="grid grid-cols-2 gap-3">
            {PERMITTED_USE_TYPE_OPTIONS.map(
              ({ value, label, labelKo }) => {
                const isSelected =
                  licenseScope.permittedUseTypes.includes(
                    value as LicenseScope["permittedUseTypes"][number]
                  );
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      toggleUseType(
                        value as LicenseScope["permittedUseTypes"][number]
                      )
                    }
                    className={`flex items-center gap-3 border px-5 py-3 text-left font-whisper text-sm transition-all duration-200 ${
                      isSelected
                        ? "border-black bg-black text-white"
                        : "border-neutral-300 bg-white hover:border-black"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
                        isSelected
                          ? "border-white bg-white"
                          : "border-neutral-400"
                      }`}
                    >
                      {isSelected && (
                        <span className="block h-2 w-2 bg-black" />
                      )}
                    </span>
                    <span>
                      {label}
                      <span className="ml-1 text-xs opacity-60">
                        ({labelKo})
                      </span>
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Geographic Scope */}
        <div className="flex flex-col gap-y-3">
          <span className="font-whisper text-sm font-medium">
            Geographic scope
          </span>
          <div className="flex gap-3">
            {GEOGRAPHIC_SCOPE_OPTIONS.map(
              ({ value, label, labelKo }) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-2 border px-5 py-3 font-whisper text-sm transition-all duration-200 ${
                    licenseScope.geographicScope === value
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 bg-white hover:border-black"
                  }`}
                >
                  <input
                    type="radio"
                    name="geographicScope"
                    value={value}
                    checked={
                      licenseScope.geographicScope === value
                    }
                    onChange={() =>
                      updateLicenseScope({
                        geographicScope:
                          value as LicenseScope["geographicScope"],
                      })
                    }
                    className="sr-only"
                  />
                  {label}
                  <span className="text-xs opacity-60">
                    ({labelKo})
                  </span>
                </label>
              )
            )}
          </div>
          {licenseScope.geographicScope === "custom" && (
            <input
              type="text"
              value={
                licenseScope.customGeographicScope || ""
              }
              onChange={(e) =>
                updateLicenseScope({
                  customGeographicScope: e.target.value,
                })
              }
              placeholder="Specify geographic scope..."
              className="mt-2 max-w-md border border-neutral-300 px-5 py-4 font-whisper text-sm placeholder:text-neutral-400"
            />
          )}
        </div>
      </div>
    </div>
  );
}
