"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useMemo, useState } from "react";
import { RiCheckLine, RiLoaderLine } from "react-icons/ri";
import {
  ButtonConnectStripe,
  ButtonViewStripeDashboard,
} from "@/components/molecules/buttons";
import { SiStripe } from "react-icons/si";
import { getStripeConnectURL } from "@/actions/stripe";
import { useStudio } from "@/hooks/use-studio";

export default function AccountStripe() {
  const { studio, isLoading: studioLoading } = useStudio();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<
    string | null
  >(null);

  const isConnected = Boolean(studio?.stripeAccountId);

  // Handle success/error from callback - compute during render instead of effect
  const callbackMessages = useMemo(() => {
    const stripeSuccess = searchParams.get(
      "stripe_success"
    );
    const stripeError = searchParams.get("stripe_error");
    return { stripeSuccess, stripeError };
  }, [searchParams]);

  // Show messages from URL params (one-time display)
  const displaySuccessMessage =
    successMessage ||
    (callbackMessages.stripeSuccess === "true"
      ? "Your Stripe account has been connected successfully!"
      : null);
  const displayError =
    error || callbackMessages.stripeError;

  // Clear URL params when user interacts (starts a new action)
  const clearUrlParams = () => {
    if (
      callbackMessages.stripeSuccess ||
      callbackMessages.stripeError
    ) {
      const url = new URL(window.location.href);
      url.searchParams.delete("stripe_success");
      url.searchParams.delete("stripe_error");
      router.replace(url.pathname + url.search);
    }
  };

  const handleConnectClick = async () => {
    clearUrlParams();
    setIsConnecting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await getStripeConnectURL();

      if (result.success && result.url) {
        // Redirect to Stripe
        window.location.href = result.url;
      } else {
        setError(
          result.error || "Failed to get Stripe connect URL"
        );
        setIsConnecting(false);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred"
      );
      setIsConnecting(false);
    }
  };

  const handleViewDashboard = async () => {
    clearUrlParams();
    setIsConnecting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await getStripeConnectURL();

      if (result.success && result.url) {
        // Open Stripe dashboard in new tab
        window.open(result.url, "_blank");
        setIsConnecting(false);
      } else {
        setError(
          result.error ||
            "Failed to access Stripe dashboard"
        );
        setIsConnecting(false);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred"
      );
      setIsConnecting(false);
    }
  };

  if (studioLoading) {
    return (
      <div className="relative flex w-full items-center justify-center py-12">
        <RiLoaderLine className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="relative flex w-full flex-col gap-y-8">
      <div>
        <h2 className="mb-2 font-bold font-ortank text-xl">
          Payment Settings
        </h2>
        <p className="font-whisper text-neutral-500">
          Connect your Stripe account to receive payments
          for font sales.
        </p>
      </div>

      {/* Success Message */}
      {displaySuccessMessage && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <RiCheckLine className="h-5 w-5 shrink-0 text-green-600" />
          <p className="font-whisper text-green-800">
            {displaySuccessMessage}
          </p>
        </div>
      )}

      {/* Error Message */}
      {displayError && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 font-bold text-white text-xs">
            !
          </div>
          <p className="font-whisper text-red-800">
            {displayError}
          </p>
        </div>
      )}

      {/* Connection Status Card */}
      <div className="rounded-lg border border-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#635BFF]">
              <SiStripe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold font-ortank text-lg">
                Stripe Connect
              </h3>
              <div className="mt-1 flex items-center gap-2">
                {isConnected ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="font-medium font-whisper text-green-600 text-sm">
                      Connected
                    </span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-neutral-400" />
                    <span className="font-whisper text-neutral-500 text-sm">
                      Not connected
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {isConnected ? (
            <ButtonViewStripeDashboard
              onClick={handleViewDashboard}
              disabled={isConnecting}
            />
          ) : (
            <ButtonConnectStripe
              onClick={handleConnectClick}
              disabled={isConnecting}
            />
          )}
        </div>

        {/* Additional Info for Not Connected State */}
        {!isConnected && (
          <div className="mt-6 border-neutral-200 border-t pt-6">
            <h4 className="mb-3 font-bold font-ortank text-sm">
              Why connect with Stripe?
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 font-whisper text-neutral-600 text-sm">
                <RiCheckLine className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Receive payments directly to your bank
                account
              </li>
              <li className="flex items-start gap-2 font-whisper text-neutral-600 text-sm">
                <RiCheckLine className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Access detailed payout reports and analytics
              </li>
              <li className="flex items-start gap-2 font-whisper text-neutral-600 text-sm">
                <RiCheckLine className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Secure payment processing by Stripe
              </li>
            </ul>
          </div>
        )}

        {/* Connected Account Info */}
        {isConnected && (
          <div className="mt-6 border-neutral-200 border-t pt-6">
            <p className="font-whisper text-neutral-500 text-sm">
              Your Stripe account is connected. You can
              manage your payouts, view transaction history,
              and update your banking details through the
              Stripe dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
