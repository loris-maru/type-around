"use client";

import { useState } from "react";
import {
  RiBankCardLine,
  RiCheckLine,
  RiInformation2Fill,
  RiLoaderLine,
  RiPaypalFill,
} from "react-icons/ri";
import {
  updatePaypalEmail,
  updateTossSubMerchantId,
} from "@/actions/studio-payments";
import ModalTossSubMerchantInfo from "@/components/modals/modal-toss-sub-merchant-info";
import { useStudio } from "@/hooks/use-studio";
import type { Studio } from "@/types/studio";

function PaymentForm({
  studio,
}: {
  studio: Studio | null;
}) {
  const [tossId, setTossId] = useState(
    studio?.tossSubMerchantId ?? ""
  );
  const [paypalEmail, setPaypalEmail] = useState(
    studio?.paypalEmail ?? ""
  );
  const [isSavingToss, setIsSavingToss] = useState(false);
  const [isSavingPaypal, setIsSavingPaypal] =
    useState(false);
  const [tossSuccess, setTossSuccess] = useState(false);
  const [paypalSuccess, setPaypalSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTossInfoOpen, setIsTossInfoOpen] =
    useState(false);

  const handleSaveToss = async () => {
    if (!studio?.id) return;
    setIsSavingToss(true);
    setError(null);
    setTossSuccess(false);
    const result = await updateTossSubMerchantId(
      studio.id,
      tossId.trim()
    );
    if (result.success) {
      setTossSuccess(true);
      setTimeout(() => setTossSuccess(false), 3000);
    } else {
      setError(result.error ?? "Failed to save");
    }
    setIsSavingToss(false);
  };

  const handleSavePaypal = async () => {
    if (!studio?.id) return;
    const email = paypalEmail.trim();
    setIsSavingPaypal(true);
    setError(null);
    setPaypalSuccess(false);
    const result = await updatePaypalEmail(
      studio.id,
      email
    );
    if (result.success) {
      setPaypalSuccess(true);
      setTimeout(() => setPaypalSuccess(false), 3000);
    } else {
      setError(result.error ?? "Failed to save");
    }
    setIsSavingPaypal(false);
  };

  return (
    <div className="relative flex w-full flex-col gap-y-8">
      <div>
        <h2 className="mb-2 font-bold font-ortank text-xl">
          Payment Settings
        </h2>
        <p className="font-whisper text-neutral-500">
          Add your payout details to receive payments for
          font sales.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 font-bold text-white text-xs">
            !
          </div>
          <p className="font-whisper text-red-800">
            {error}
          </p>
        </div>
      )}

      {/* Toss (Local) */}
      <div className="rounded-lg border border-neutral-200 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#0064FF]">
            <RiBankCardLine className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold font-ortank text-lg">
                Local Payout (Toss)
              </h3>
              <button
                type="button"
                onClick={() => setIsTossInfoOpen(true)}
                aria-label="서브몰 ID 발급 방법"
                title="서브몰 ID 발급 방법"
                className="inline-flex shrink-0 items-center justify-center rounded-full text-blue-600 transition-colors hover:border-neutral-400 hover:bg-neutral-50 hover:text-black"
              >
                <RiInformation2Fill
                  className="h-5 w-5"
                  aria-hidden
                />
              </button>
            </div>
            <p className="mt-0.5 font-whisper text-neutral-500 text-sm">
              Toss/KakaoPay/Naver Pay 결제용 하위 가맹점 ID
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <input
            type="text"
            value={tossId}
            onChange={(e) => setTossId(e.target.value)}
            placeholder="Sub-merchant ID"
            className="flex-1 rounded-lg border border-neutral-200 px-4 py-2 font-whisper text-sm"
          />
          <button
            type="button"
            onClick={handleSaveToss}
            disabled={isSavingToss}
            className="rounded-lg bg-black px-4 py-2 font-whisper text-sm text-white disabled:opacity-60"
          >
            {isSavingToss ? (
              <RiLoaderLine className="h-4 w-4 animate-spin" />
            ) : tossSuccess ? (
              <RiCheckLine className="h-4 w-4 text-green-400" />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>

      <ModalTossSubMerchantInfo
        isOpen={isTossInfoOpen}
        onClose={() => setIsTossInfoOpen(false)}
      />

      {/* PayPal (Global) */}
      <div className="rounded-lg border border-neutral-200 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#003087]">
            <RiPaypalFill className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold font-ortank text-lg">
              Global Payout (PayPal)
            </h3>
            <p className="font-whisper text-neutral-500 text-sm">
              PayPal email for international sales
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <input
            type="email"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
            placeholder="your@paypal.email"
            className="flex-1 rounded-lg border border-neutral-200 px-4 py-2 font-whisper text-sm"
          />
          <button
            type="button"
            onClick={handleSavePaypal}
            disabled={isSavingPaypal}
            className="rounded-lg bg-black px-4 py-2 font-whisper text-sm text-white disabled:opacity-60"
          >
            {isSavingPaypal ? (
              <RiLoaderLine className="h-4 w-4 animate-spin" />
            ) : paypalSuccess ? (
              <RiCheckLine className="h-4 w-4 text-green-400" />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AccountPayments() {
  const { studio, isLoading: studioLoading } = useStudio();

  if (studioLoading) {
    return (
      <div className="relative flex w-full items-center justify-center py-12">
        <RiLoaderLine className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <PaymentForm
      key={studio?.id ?? "loading"}
      studio={studio ?? null}
    />
  );
}
