export const TOSS_CLIENT_KEY =
  process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? "";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

export function getTossSuccessUrl(
  orderId: string,
  token: string
): string {
  return `${APP_URL}/checkout/success?token=${token}&provider=toss`;
}

export function getTossFailUrl(): string {
  return `${APP_URL}/checkout?error=toss_failed`;
}
