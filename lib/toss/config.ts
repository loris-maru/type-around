const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY ?? "";

export function getTossAuthHeader(): string {
  if (!TOSS_SECRET_KEY) {
    throw new Error(
      "TOSS_SECRET_KEY is not defined in environment variables"
    );
  }
  return Buffer.from(`${TOSS_SECRET_KEY}:`).toString(
    "base64"
  );
}
