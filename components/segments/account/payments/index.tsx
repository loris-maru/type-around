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
import AccountPageHeader from "../page-header";
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
    <div className="relative flex w-full flex-col gap-y-10">
      <AccountPageHeader
        eyebrow="09 Payments"
        title="Payment settings"
        description="Add your payout details to receive payments for font sales."
      />

      {error && (
        <div className="flex items-start gap-3 border border-swiss-red p-4">
          <span className="swiss-label mt-0.5 text-swiss-red">
            Error
          </span>
          <p className="swiss-body text-swiss-ink">
            {error}
          </p>
        </div>
      )}

      {/* Toss (Local) */}
      <div className="swiss-rule grid grid-cols-12 gap-x-6 py-6">
        <div className="col-span-1">
          <span className="swiss-label text-neutral-500">
            01
          </span>
        </div>
        <div className="col-span-11 flex items-start gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-swiss-ink">
            <RiBankCardLine className="h-5 w-5 text-swiss-ink" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="swiss-h2">
                Local Payout (Toss)
              </h3>
              <button
                type="button"
                onClick={() => setIsTossInfoOpen(true)}
                aria-label="서브몰 ID 발급 방법"
                title="서브몰 ID 발급 방법"
                className="inline-flex shrink-0 items-center justify-center text-neutral-400 transition-colors hover:text-swiss-red"
              >
                <RiInformation2Fill
                  className="h-5 w-5"
                  aria-hidden
                />
              </button>
            </div>
            <p className="swiss-body mt-2 text-neutral-500 text-sm">
              Toss/KakaoPay/Naver Pay 결제용 하위 가맹점 ID
            </p>
          </div>
        </div>
        <div className="col-span-11 col-start-2 mt-6 flex items-end gap-4">
          <input
            type="text"
            value={tossId}
            onChange={(e) => setTossId(e.target.value)}
            placeholder="Sub-merchant ID"
            className="swiss-field swiss-num flex-1"
          />
          <button
            type="button"
            onClick={handleSaveToss}
            disabled={isSavingToss}
            className="swiss-btn swiss-btn-solid w-32"
          >
            {isSavingToss ? (
              <RiLoaderLine className="h-4 w-4 animate-spin" />
            ) : tossSuccess ? (
              <RiCheckLine className="h-4 w-4" />
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
      <div className="swiss-rule grid grid-cols-12 gap-x-6 border-swiss-ink border-b py-6">
        <div className="col-span-1">
          <span className="swiss-label text-neutral-500">
            02
          </span>
        </div>
        <div className="col-span-11 flex items-start gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-swiss-ink">
            <RiPaypalFill className="h-5 w-5 text-swiss-ink" />
          </div>
          <div>
            <h3 className="swiss-h2">
              Global Payout (PayPal)
            </h3>
            <p className="swiss-body mt-2 text-neutral-500 text-sm">
              PayPal email for international sales
            </p>
          </div>
        </div>
        <div className="col-span-11 col-start-2 mt-6 flex items-end gap-4">
          <input
            type="email"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
            placeholder="your@paypal.email"
            className="swiss-field swiss-num flex-1"
          />
          <button
            type="button"
            onClick={handleSavePaypal}
            disabled={isSavingPaypal}
            className="swiss-btn swiss-btn-solid w-32"
          >
            {isSavingPaypal ? (
              <RiLoaderLine className="h-4 w-4 animate-spin" />
            ) : paypalSuccess ? (
              <RiCheckLine className="h-4 w-4" />
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
