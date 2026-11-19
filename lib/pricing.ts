export const GST_RATE = 0.05;
/** Name-change ads are charged 18% GST; every other category stays at 5%. */
export const NAME_CHANGE_GST_RATE = 0.18;
export const CONVENIENCE_FEE_RATE = 0.025;

export type Pricing = {
  /** Package rate in paise. */
  basePaise: number;
  /** GST in paise. */
  gstPaise: number;
  /** GST rate actually applied (0.05 default, 0.18 for name-change). */
  gstRate: number;
  /** Convenience fee (2.5%) in paise, charged on base + GST. */
  conveniencePaise: number;
  /** Base + GST + convenience fee, in paise. */
  totalPaise: number;
};

export function calculatePricing(
  rateRupees: number,
  options?: { gstRate?: number },
): Pricing {
  const gstRate = options?.gstRate ?? GST_RATE;
  const basePaise = Math.round(rateRupees * 100);
  const gstPaise = Math.round(basePaise * gstRate);
  // Convenience fee applies on the GST-inclusive amount, not on the base rate alone.
  const conveniencePaise = Math.round(
    (basePaise + gstPaise) * CONVENIENCE_FEE_RATE,
  );

  return {
    basePaise,
    gstPaise,
    gstRate,
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
