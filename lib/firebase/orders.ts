import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import type { Order } from "@/types/order";
import { ordersDb } from "./config";

const COLLECTION_NAME = "orders";

export async function createOrder(
  order: Order
): Promise<string> {
  const ref = doc(
    collection(ordersDb, COLLECTION_NAME),
    order.id
  );
  await setDoc(ref, {
    ...order,
    createdAt: order.createdAt || new Date().toISOString(),
  });
  return order.id;
}

export async function getOrderById(
  orderId: string
): Promise<Order | null> {
  const ref = doc(ordersDb, COLLECTION_NAME, orderId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as Order;
}

export async function getOrderByDownloadToken(
  orderId: string,
  token: string
): Promise<Order | null> {
  const order = await getOrderById(orderId);
  if (!order || order.downloadToken !== token) return null;
  return order;
}

export async function getOrdersByUserId(
  userId: string
): Promise<Order[]> {
  const q = query(
    collection(ordersDb, COLLECTION_NAME),
    where("userId", "==", userId),
    where("status", "==", "paid")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Order);
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  stripeSessionId?: string,
  stripePaymentIntentId?: string
): Promise<void> {
  const ref = doc(ordersDb, COLLECTION_NAME, orderId);
  await updateDoc(ref, {
    status,
    ...(stripeSessionId && { stripeSessionId }),
    ...(stripePaymentIntentId && { stripePaymentIntentId }),
  });
}
