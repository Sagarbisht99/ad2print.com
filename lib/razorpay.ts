import Razorpay from "razorpay";

export const RAZORPAY_CURRENCY = "INR";

export function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be configured");
  }

  return {
    keyId,
    client: new Razorpay({ key_id: keyId, key_secret: keySecret }),
  };
}
