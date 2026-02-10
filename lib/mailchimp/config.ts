import mailchimp from "@mailchimp/mailchimp_marketing";

const API_KEY = process.env.MAILCHIMP_API_KEY || "";
const SERVER_PREFIX =
  process.env.MAILCHIMP_SERVER_PREFIX || "";
export const AUDIENCE_ID =
  process.env.MAILCHIMP_AUDIENCE_ID || "";

mailchimp.setConfig({
  apiKey: API_KEY,
  server: SERVER_PREFIX,
});

export default mailchimp;
