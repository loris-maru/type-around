import * as paypal from "@paypal/checkout-server-sdk";
import {
  type NextRequest,
  NextResponse,
} from "next/server";
import {
  getOrderById,
  updateOrderStatus,
} from "@/lib/firebase/orders";
import { getPayPalClient } from "@/lib/paypal/config";
import { sendOrderConfirmationEmail } from "@/lib/postmark";

type CaptureResource = {
  id?: string;
  status?: string;
  supplementary_data?: {
    related_ids?: { order_id?: string };
  };
};

/**
 * PayPal webhook – verifies capture server-side before updating order.
 * Configure this URL in PayPal Developer Dashboard.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      event_type?: string;
      resource?: CaptureResource;
    };

    if (body.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
      return NextResponse.json({ received: true });
    }

    const resource = body.resource;
    if (!resource || resource.status !== "COMPLETED") {
      return NextResponse.json({ received: true });
    }

    const captureId = resource.id;
    const paypalOrderId =
      resource.supplementary_data?.related_ids?.order_id;

    if (!paypalOrderId) {
      return NextResponse.json({ received: true });
    }

    const client = getPayPalClient();
    const orderRequest = new paypal.orders.OrdersGetRequest(
      paypalOrderId
    );
    const orderRes = await client.execute(orderRequest);

    if (orderRes.statusCode !== 200) {
      console.error(
        "PayPal webhook: failed to fetch order"
      );
      return NextResponse.json({ received: true });
    }

    const paypalOrder = orderRes.result as {
      purchase_units?: Array<{ reference_id?: string }>;
    };
    const orderId =
      paypalOrder.purchase_units?.[0]?.reference_id;

    if (!orderId) {
      console.error(
        "PayPal webhook: no reference_id in order"
      );
      return NextResponse.json({ received: true });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      console.error(
        "PayPal webhook: order not found",
        orderId
      );
      return NextResponse.json({ received: true });
    }

    if (order.status === "paid") {
      return NextResponse.json({ received: true });
    }

    await updateOrderStatus(orderId, "paid", {
      paymentProvider: "paypal",
      paypalOrderId: captureId ?? paypalOrderId,
    });

    try {
      await sendOrderConfirmationEmail(
        order.email,
        orderId,
        order.downloadToken
      );
    } catch (emailErr) {
      console.error(
        "PayPal webhook: email failed",
        emailErr
      );
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("PayPal webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
