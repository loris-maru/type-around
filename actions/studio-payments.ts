"use server";

import { auth } from "@clerk/nextjs/server";
import {
  updateStudioTossSubMerchantId,
  updateStudioPaypalEmail,
} from "@/lib/firebase/studios";

export type UpdatePaymentResult = {
  success: boolean;
  error?: string;
};

export async function updateTossSubMerchantId(
  studioId: string,
  tossSubMerchantId: string
): Promise<UpdatePaymentResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }
    if (userId !== studioId) {
      return { success: false, error: "Not authorized" };
    }
    await updateStudioTossSubMerchantId(
      studioId,
      tossSubMerchantId
    );
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to update",
    };
  }
}

export async function updatePaypalEmail(
  studioId: string,
  paypalEmail: string
): Promise<UpdatePaymentResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }
    if (userId !== studioId) {
      return { success: false, error: "Not authorized" };
    }
    if (
      paypalEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail)
    ) {
      return {
        success: false,
        error: "Invalid email address",
      };
    }
    await updateStudioPaypalEmail(studioId, paypalEmail);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to update",
    };
  }
}
