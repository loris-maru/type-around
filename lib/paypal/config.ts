import * as paypal from "@paypal/checkout-server-sdk";

let paypalClient: InstanceType<
  typeof paypal.core.PayPalHttpClient
> | null = null;

export function getPayPalClient() {
  if (!paypalClient) {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error(
        "PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be defined"
      );
    }

    const env =
      process.env.NODE_ENV === "production"
        ? new paypal.core.LiveEnvironment(
            clientId,
            clientSecret
          )
        : new paypal.core.SandboxEnvironment(
            clientId,
            clientSecret
          );

    paypalClient = new paypal.core.PayPalHttpClient(env);
  }
  return paypalClient;
}
