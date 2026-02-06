import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";
import { getStudiosByUserEmail } from "@/lib/firebase/studios";

export default async function AccountPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const email = user.primaryEmailAddress?.emailAddress;

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-ortank font-bold mb-4">
            No Email Found
          </h1>
          <p className="text-neutral-500 font-whisper">
            Please add an email address to your account.
          </p>
        </div>
      </div>
    );
  }

  const studios = await getStudiosByUserEmail(email);

  // If user has exactly one studio, redirect to it
  if (studios.length === 1) {
    redirect(`/account/${studios[0].id}`);
  }

  // If user has no studios
  if (studios.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-ortank font-bold mb-4">
            No Studio Found
          </h1>
          <p className="text-neutral-500 font-whisper mb-6">
            You are not associated with any studio yet.
            Please contact an administrator to be added to a
            studio.
          </p>
        </div>
      </div>
    );
  }

  // If user has multiple studios, show a list
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-ortank font-bold mb-4">
            Select a Studio
          </h1>
          <p className="text-neutral-500 font-whisper">
            You have access to multiple studios. Choose
            which one to manage.
          </p>
        </div>

        <div className="grid gap-4">
          {studios.map((studio) => {
            const isOwner = studio.ownerEmail === email;
            const member = studio.members?.find(
              (m) => m.email === email
            );
            const role = isOwner
              ? "Owner"
              : member?.role || "Member";

            return (
              <Link
                key={studio.id}
                href={`/account/${studio.id}`}
                className="group flex items-center justify-between p-6 bg-white border border-neutral-200 rounded-xl hover:border-black hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* Studio Avatar */}
                  <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden">
                    {studio.avatar ? (
                      <Image
                        src={studio.avatar}
                        alt={studio.name || "Studio avatar"}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-ortank font-bold text-neutral-400">
                        {studio.name?.charAt(0) || "S"}
                      </span>
                    )}
                  </div>

                  {/* Studio Info */}
                  <div>
                    <h2 className="text-lg font-ortank font-bold group-hover:text-black">
                      {studio.name || "Unnamed Studio"}
                    </h2>
                    <p className="text-sm text-neutral-500 font-whisper">
                      {studio.typefaces?.length || 0}{" "}
                      typeface
                      {(studio.typefaces?.length || 0) !== 1
                        ? "s"
                        : ""}
                      {studio.location &&
                        ` · ${studio.location}`}
                    </p>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-whisper font-medium ${
                      isOwner
                        ? "bg-black text-white"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {role}
                  </span>
                  <svg
                    className="w-5 h-5 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <title>Go to studio</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
