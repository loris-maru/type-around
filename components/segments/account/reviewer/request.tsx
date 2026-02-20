"use client";

export default function AccountReviewerRequest() {
  return (
    <div className="relative flex w-full flex-col gap-y-28 pb-20">
      <div>
        <h1 className="font-ortank font-bold text-2xl text-neutral-800">
          Request
        </h1>
        <p className="mt-2 font-whisper text-neutral-600 text-sm">
          View and manage incoming feedback requests.
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center">
        <p className="font-whisper text-neutral-500 text-sm">
          No feedback requests yet.
        </p>
      </div>
    </div>
  );
}
