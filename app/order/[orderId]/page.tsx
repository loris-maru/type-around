import Link from "next/link";
import { redirect } from "next/navigation";
import OrderDownloadPage from "@/components/segments/order/order-download-page";
import { getOrderByDownloadToken } from "@/lib/firebase/orders";

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { orderId } = await params;
  const { token } = await searchParams;

  if (!token) {
    redirect("/");
  }

  let order = null;
  try {
    order = await getOrderByDownloadToken(orderId, token);
  } catch {
    // Firebase permission errors, network issues, etc. — treat as not found
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <h1 className="font-bold font-ortank text-xl">
          Order not found
        </h1>
        <p className="text-center font-whisper text-neutral-600">
          This order does not exist or the link has expired.
        </p>
        <Link
          href="/studio"
          className="rounded-lg bg-black px-6 py-3 font-whisper text-white"
        >
          Back to studio
        </Link>
      </div>
    );
  }

  return <OrderDownloadPage order={order} />;
}
