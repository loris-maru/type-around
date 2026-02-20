import {
  type NextRequest,
  NextResponse,
} from "next/server";
import {
  getOrderById,
  updateOrderStatus,
} from "@/lib/firebase/orders";
import { sendOrderConfirmationEmail } from "@/lib/postmark";
import { getStripe } from "@/lib/stripe/config";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error(
      "Missing Stripe webhook secret or signature"
    );
    return NextResponse.json(
      { error: "Webhook configuration error" },
      { status: 500 }
    );
  }

  let event: {
    type: string;
    data: {
      object: {
        id?: string;
        metadata?: { orderId?: string };
      };
    };
  };

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    ) as typeof event;
  } catch (err) {
    console.error(
      "Webhook signature verification failed:",
      err
    );
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error("No orderId in session metadata");
      return NextResponse.json({ received: true });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      console.error("Order not found:", orderId);
      return NextResponse.json({ received: true });
    }

    if (order.status === "paid") {
      return NextResponse.json({ received: true });
    }

    await updateOrderStatus(
      orderId,
      "paid",
      session.id,
      (session as { payment_intent?: string })
        .payment_intent
    );

    try {
      await sendOrderConfirmationEmail(
        order.email,
        orderId,
        order.downloadToken
      );
    } catch (emailErr) {
      console.error(
        "Failed to send order confirmation email:",
        emailErr
      );
    }

    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
