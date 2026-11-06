export const GST_RATE = 0.05;
export const CONVENIENCE_FEE_RATE = 0.025;

export type Pricing = {
  /** Package rate in paise. */
  basePaise: number;
  /** GST (5%) in paise. */
  gstPaise: number;
  /** Convenience fee (2.5%) in paise. */
  conveniencePaise: number;
  /** Base + GST + convenience fee, in paise. */
  totalPaise: number;
};

export function calculatePricing(rateRupees: number): Pricing {
  const basePaise = Math.round(rateRupees * 100);
  const gstPaise = Math.round(basePaise * GST_RATE);
  const conveniencePaise = Math.round(basePaise * CONVENIENCE_FEE_RATE);

  return {
    basePaise,
    gstPaise,
    conveniencePaise,
    totalPaise: basePaise + gstPaise + conveniencePaise,
  };
}

export function formatInr(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(paise / 100);
}
