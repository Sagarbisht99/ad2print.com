export const GST_RATE = 0.05;
/** Name-change ads outside Delhi are charged 18% GST; every other category stays at 5%. */
export const NAME_CHANGE_GST_RATE = 0.18;
export const CONVENIENCE_FEE_RATE = 0.025;

/** True for "Delhi", "New Delhi" and editions such as "Delhi NCR". */
export function isDelhiCity(city?: string | null) {
  return /^(new\s+)?delhi\b/i.test(city?.trim() ?? "");
}

/**
 * Delhi name-change ads stay on the 5% GST slab; every other city pays 18%.
 * Always derive the rate from the server-resolved city, never from the client.
 */
export function nameChangeGstRate(city?: string | null) {
  return isDelhiCity(city) ? GST_RATE : NAME_CHANGE_GST_RATE;
}

export type Pricing = {
  /** Package rate in paise. */
  basePaise: number;
  /** GST in paise. */
  gstPaise: number;
  /** GST rate actually applied (0.05 default and for Delhi name-change, 0.18 elsewhere). */
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
