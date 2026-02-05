"use client";

import { useStudio } from "@/hooks/use-studio";
import AccountForm from "./form";
import ACCOUNT_FORM from "./information/ACCOUNT_FORM";
import SOCIAL_FORM from "./information/SOCIAL_FORM";

export default function AccountInformation() {
  const {
    studio,
    isLoading,
    updateInformation,
    updateSocialMedia,
  } = useStudio();

  const handleAccountSubmit = async (
    values: Record<string, string>
  ) => {
    await updateInformation({
      name: values.name,
      location: values.location,
      foundedIn: values.foundedIn,
      contactEmail: values.email,
      website: values.website,
    });
  };

  const handleSocialSubmit = async (
    values: Record<string, string>
  ) => {
    const socialMedia = [
      { name: "instagram", url: values.instagram || "" },
      { name: "twitter", url: values.x || "" },
      { name: "linkedin", url: values.linkedin || "" },
      { name: "behance", url: values.behance || "" },
    ].filter((s) => s.url);

    await updateSocialMedia(socialMedia);
  };

  // Map studio data to form values
  const studioInitialValues = studio
    ? {
        name: studio.name,
        location: studio.location,
        foundedIn: studio.foundedIn,
        email: studio.contactEmail,
        website: studio.website,
      }
    : undefined;

  const socialInitialValues = studio
    ? {
        instagram:
          studio.socialMedia.find(
            (s) => s.name === "instagram"
          )?.url || "",
        x:
          studio.socialMedia.find(
            (s) => s.name === "twitter"
          )?.url || "",
        linkedin:
          studio.socialMedia.find(
            (s) => s.name === "linkedin"
          )?.url || "",
        behance:
          studio.socialMedia.find(
            (s) => s.name === "behance"
          )?.url || "",
      }
    : undefined;

  return (
    <div className="relative w-full flex flex-col gap-y-12">
      <AccountForm
        title="Studio Information"
        FORM_FIELDS={ACCOUNT_FORM}
        initialValues={studioInitialValues}
        onSubmit={handleAccountSubmit}
        isLoading={isLoading}
      />
      <AccountForm
        title="Social Media"
        FORM_FIELDS={SOCIAL_FORM}
        initialValues={socialInitialValues}
        onSubmit={handleSocialSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
