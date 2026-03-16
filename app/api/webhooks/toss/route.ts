import {
  type NextRequest,
  NextResponse,
} from "next/server";
import {
  getOrderById,
  updateOrderStatus,
} from "@/lib/firebase/orders";
import { sendOrderConfirmationEmail } from "@/lib/postmark";
import { getTossAuthHeader } from "@/lib/toss/config";

/**
 * Toss Payments webhook – verifies payment server-side before updating order.
 * Configure this URL in Toss Payments Developer Center.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      eventType?: string;
      paymentKey?: string;
      orderId?: string;
      status?: string;
      totalAmount?: number;
    };

    const { eventType, paymentKey, orderId, status } = body;

    if (
      eventType !== "PAYMENT_STATUS_CHANGED" ||
      status !== "DONE"
    ) {
      return NextResponse.json({ received: true });
    }

    if (!paymentKey || !orderId) {
      console.error(
        "Toss webhook: missing paymentKey or orderId"
      );
      return NextResponse.json({ received: true });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      console.error(
        "Toss webhook: order not found",
        orderId
      );
      return NextResponse.json({ received: true });
    }

    if (order.status === "paid") {
      return NextResponse.json({ received: true });
    }

    const amount = body.totalAmount ?? order.totalCents;
    if (order.totalCents !== amount) {
      console.error("Toss webhook: amount mismatch", {
        orderId,
        expected: order.totalCents,
        received: amount,
      });
      return NextResponse.json({ received: true });
    }

    const authHeader = getTossAuthHeader();
    const verifyRes = await fetch(
      `https://api.tosspayments.com/v1/payments/${paymentKey}`,
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
        },
      }
    );

    if (!verifyRes.ok) {
      console.error(
        "Toss webhook: verify failed",
        paymentKey
      );
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 }
      );
    }

    const payment = (await verifyRes.json()) as {
      status?: string;
    };
    if (payment.status !== "DONE") {
      return NextResponse.json({ received: true });
    }

    await updateOrderStatus(orderId, "paid", {
      paymentProvider: "toss",
      tossPaymentKey: paymentKey,
    });

    try {
      await sendOrderConfirmationEmail(
        order.email,
        orderId,
        order.downloadToken
      );
    } catch (emailErr) {
      console.error("Toss webhook: email failed", emailErr);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Toss webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
