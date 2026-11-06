"use client";

export type RazorpayPaymentResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayFailure = {
  error?: { description?: string; reason?: string };
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: { ondismiss?: () => void };
};

type RazorpayInstance = {
  open: () => void;
  on: (event: "payment.failed", handler: (response: RazorpayFailure) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export class PaymentCancelledError extends Error {
  constructor() {
    super("Payment cancelled.");
    this.name = "PaymentCancelledError";
  }
}

let scriptPromise: Promise<boolean> | null = null;

function loadRazorpayScript() {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<boolean>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      scriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export async function openRazorpayCheckout(options: {
  key: string;
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
}): Promise<RazorpayPaymentResponse> {
  const loaded = await loadRazorpayScript();
  const RazorpayCtor = loaded ? window.Razorpay : undefined;
  if (!RazorpayCtor) {
    throw new Error("Could not load the payment window. Check your connection and try again.");
  }

  return new Promise<RazorpayPaymentResponse>((resolve, reject) => {
    const razorpay = new RazorpayCtor({
      key: options.key,
      amount: options.amount,
      currency: options.currency,
      name: "AD2PRINT",
      description: options.description,
      order_id: options.orderId,
      prefill: options.prefill,
      notes: options.notes,
      theme: { color: "#B21F2D" },
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject(new PaymentCancelledError()),
      },
    });

    razorpay.on("payment.failed", (response) => {
      reject(
        new Error(
          response.error?.description ||
            response.error?.reason ||
            "Payment failed. Please try again or contact the desk.",
        ),
      );
    });

    razorpay.open();
  });
}
