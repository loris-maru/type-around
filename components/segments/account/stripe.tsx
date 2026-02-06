"use client";

import { useState, useMemo } from "react";
import {
  useSearchParams,
  useRouter,
} from "next/navigation";
import {
  RiCheckLine,
  RiExternalLinkLine,
  RiLoaderLine,
} from "react-icons/ri";
import { SiStripe } from "react-icons/si";
import { useStudio } from "@/hooks/use-studio";
import { getStripeConnectURL } from "@/actions/stripe";

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
      <div className="relative w-full flex items-center justify-center py-12">
        <RiLoaderLine className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="relative w-full flex flex-col gap-y-8">
      <div>
        <h2 className="text-xl font-ortank font-bold mb-2">
          Payment Settings
        </h2>
        <p className="text-neutral-500 font-whisper">
          Connect your Stripe account to receive payments
          for font sales.
        </p>
      </div>

      {/* Success Message */}
      {displaySuccessMessage && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <RiCheckLine className="w-5 h-5 text-green-600 shrink-0" />
          <p className="text-green-800 font-whisper">
            {displaySuccessMessage}
          </p>
        </div>
      )}

      {/* Error Message */}
      {displayError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 text-xs font-bold">
            !
          </div>
          <p className="text-red-800 font-whisper">
            {displayError}
          </p>
        </div>
      )}

      {/* Connection Status Card */}
      <div className="border border-neutral-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#635BFF] rounded-lg flex items-center justify-center">
              <SiStripe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-ortank font-bold text-lg">
                Stripe Connect
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {isConnected ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-green-600 font-whisper font-medium">
                      Connected
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-neutral-400" />
                    <span className="text-sm text-neutral-500 font-whisper">
                      Not connected
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {isConnected ? (
            <button
              type="button"
              onClick={handleViewDashboard}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isConnecting ? (
                <RiLoaderLine className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span className="font-whisper font-medium">
                    View Payouts & Settings
                  </span>
                  <RiExternalLinkLine className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConnectClick}
              disabled={isConnecting}
              className="flex items-center gap-2 px-6 py-3 bg-[#635BFF] text-white rounded-lg hover:bg-[#5851db] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isConnecting ? (
                <>
                  <RiLoaderLine className="w-4 h-4 animate-spin" />
                  <span className="font-whisper font-medium">
                    Connecting...
                  </span>
                </>
              ) : (
                <>
                  <SiStripe className="w-4 h-4" />
                  <span className="font-whisper font-medium">
                    Connect with Stripe
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Additional Info for Not Connected State */}
        {!isConnected && (
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <h4 className="font-ortank font-bold text-sm mb-3">
              Why connect with Stripe?
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-neutral-600 font-whisper">
                <RiCheckLine className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                Receive payments directly to your bank
                account
              </li>
              <li className="flex items-start gap-2 text-sm text-neutral-600 font-whisper">
                <RiCheckLine className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                Access detailed payout reports and analytics
              </li>
              <li className="flex items-start gap-2 text-sm text-neutral-600 font-whisper">
                <RiCheckLine className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                Secure payment processing by Stripe
              </li>
            </ul>
          </div>
        )}

        {/* Connected Account Info */}
        {isConnected && (
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <p className="text-sm text-neutral-500 font-whisper">
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
