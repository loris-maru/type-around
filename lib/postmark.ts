import postmark from "postmark";

let client: postmark.ServerClient | null = null;

function getPostmarkClient(): postmark.ServerClient {
  if (!client) {
    const token = process.env.POSTMARK_SERVER_TOKEN;
    if (!token) {
      throw new Error(
        "POSTMARK_SERVER_TOKEN is not defined"
      );
    }
    client = new postmark.ServerClient(token);
  }
  return client;
}

export async function sendOrderConfirmationEmail(
  to: string,
  orderId: string,
  downloadToken: string
): Promise<void> {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";
  const downloadUrl = `${appUrl}/order/${orderId}?token=${downloadToken}`;

  await getPostmarkClient().sendEmail({
    From:
      process.env.POSTMARK_FROM_EMAIL ||
      "orders@type-around.com",
    To: to,
    Subject: "Your font purchase – download link",
    HtmlBody: `
      <h2>Thank you for your purchase</h2>
      <p>Your order has been confirmed. Click the link below to download your fonts:</p>
      <p><a href="${downloadUrl}">Download your fonts</a></p>
      <p>This link is unique to your order. If you have any questions, please contact us.</p>
    `,
    MessageStream: "outbound",
  });
}
