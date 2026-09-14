import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RiArrowRightLine } from "react-icons/ri";
import { getStudiosByUserEmail } from "@/lib/firebase/studios";

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="account-swiss flex min-h-screen items-center bg-white px-10">
      <div className="swiss-rule w-full max-w-2xl pt-3">
        <div className="swiss-label mb-6 flex items-center gap-2 text-neutral-500">
          <span className="inline-block h-2 w-2 bg-swiss-red" />
          Account
        </div>
        <h1 className="swiss-h1">{title}</h1>
        <p className="swiss-body mt-6 text-neutral-600">
          {description}
        </p>
      </div>
    </div>
  );
}

export default async function AccountPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const email = user.primaryEmailAddress?.emailAddress;

  if (!email) {
    return (
      <EmptyState
        title="No email found"
        description="Please add an email address to your account."
      />
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
      <EmptyState
        title="No studio found"
        description="You are not associated with any studio yet. Please contact an administrator to be added to a studio."
      />
    );
  }

  // If user has multiple studios, show a list
  return (
    <div className="account-swiss min-h-screen bg-white px-10 pt-24 pb-24">
      <div className="grid w-full grid-cols-12 gap-x-6">
        <header className="swiss-rule col-span-12 pt-3 pb-16 lg:col-span-4">
          <div className="swiss-label mb-6 flex items-center gap-2 text-neutral-500">
            <span className="inline-block h-2 w-2 bg-swiss-red" />
            Account
          </div>
          <h1 className="swiss-display">Select a studio</h1>
          <p className="swiss-body mt-6 text-neutral-600">
            You have access to several studios. Choose which
            one to manage.
          </p>
          <div className="mt-10 flex flex-col">
            <span className="swiss-label text-neutral-500">
              Studios
            </span>
            <span className="swiss-num text-6xl leading-none">
              {studios.length}
            </span>
          </div>
        </header>

        <ol className="swiss-rule col-span-12 flex flex-col divide-y divide-neutral-200 lg:col-span-8">
          {studios.map((studio, studioIndex) => {
            const isOwner = studio.ownerEmail === email;
            const member = studio.members?.find(
              (m) => m.email === email
            );
            const role = isOwner
              ? "Owner"
              : member?.role || "Member";
            const typefaceCount =
              studio.typefaces?.length || 0;

            return (
              <li key={studio.id}>
                <Link
                  href={`/account/${studio.id}`}
                  className="group grid grid-cols-12 items-center gap-x-6 py-6 transition-colors hover:bg-black hover:text-white"
                >
                  <span className="swiss-num col-span-1 pl-2 text-neutral-500 text-xs group-hover:text-neutral-400">
                    {String(studioIndex + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <div className="col-span-1 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-neutral-100">
                    {studio.avatar ? (
                      <Image
                        src={studio.avatar}
                        alt={studio.name || "Studio avatar"}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-godo text-neutral-400 text-xl">
                        {studio.name?.charAt(0) || "S"}
                      </span>
                    )}
                  </div>

                  <div className="col-span-6 flex flex-col gap-1">
                    <h2 className="swiss-h2">
                      {studio.name || "Unnamed studio"}
                    </h2>
                    <p className="font-sotto text-neutral-500 text-sm group-hover:text-neutral-400">
                      {typefaceCount} typeface
                      {typefaceCount !== 1 ? "s" : ""}
                      {studio.location &&
                        ` · ${studio.location}`}
                    </p>
                  </div>

                  <div className="col-span-3 flex items-center gap-2">
                    <span
                      className={
                        isOwner
                          ? "inline-block h-2 w-2 bg-swiss-red"
                          : "inline-block h-2 w-2 bg-neutral-300"
                      }
                    />
                    <span className="swiss-label">
                      {role}
                    </span>
                  </div>

                  <RiArrowRightLine
                    aria-hidden
                    className="col-span-1 h-5 w-5 justify-self-end pr-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-white"
                  />
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
