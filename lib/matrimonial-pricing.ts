/**
 * Matrimonial wording pricing.
 *
 * The package rate covers the first 5 lines of ad matter. Every additional
 * line adds 20% of that package rate. Add-ons are charged as a percentage of
 * the wording-adjusted rate. Schemes (2+2, 3+3) multiply the per-ad rate by
 * the number of paid insertions; the matching free insertions are included.
 *
 * Kept free of data/JSON imports so the same maths runs on the client preview
 * and on the server that creates the Razorpay order.
 */

export const MATRIMONIAL_INCLUDED_LINES = 5;
export const MATRIMONIAL_EXTRA_LINE_RATE = 0.2;

/**
 * A newspaper matrimonial column fits roughly 28 characters per line.
 * The sample wording from the reference site is counted as 5 lines at this
 * width, which is what the pricing rule below is built around.
 */
export const MATRIMONIAL_CHARS_PER_LINE = 28;

export const MATRIMONIAL_SCHEME_IDS = ["none", "2+2", "3+3"] as const;

export type MatrimonialSchemeId = (typeof MATRIMONIAL_SCHEME_IDS)[number];

export type MatrimonialScheme = {
  id: MatrimonialSchemeId;
  label: string;
  /** Number of ads the customer pays for. */
  paidAds: number;
  /** Number of ads given free with the scheme. */
  freeAds: number;
};

export const MATRIMONIAL_SCHEMES: Record<MatrimonialSchemeId, MatrimonialScheme> = {
  none: { id: "none", label: "None", paidAds: 1, freeAds: 0 },
  "2+2": {
    id: "2+2",
    label: "2+2 (Buy 2 Ads, Get 2 More Ads Free. Total 4 Ads)",
    paidAds: 2,
    freeAds: 2,
  },
  "3+3": {
    id: "3+3",
    label: "3+3 (Buy 3 Ads, Get 3 More Ads Free. Total 6 Ads)",
    paidAds: 3,
    freeAds: 3,
  },
};

export function isMatrimonialSchemeId(value: unknown): value is MatrimonialSchemeId {
  return (
    typeof value === "string" &&
    (MATRIMONIAL_SCHEME_IDS as readonly string[]).includes(value)
  );
}

export const MATRIMONIAL_ADDON_IDS = ["background", "border", "tick"] as const;

export type MatrimonialAddOnId = (typeof MATRIMONIAL_ADDON_IDS)[number];

export type MatrimonialAddOn = {
  id: MatrimonialAddOnId;
  label: string;
  /** Percentage of the wording-adjusted rate, e.g. 0.2 for 20%. */
  rate: number;
  hint: string;
};

export const MATRIMONIAL_ADDONS: Record<MatrimonialAddOnId, MatrimonialAddOn> = {
  background: { id: "background", label: "Background colour", rate: 0.2, hint: "20% extra" },
  border: { id: "border", label: "Screen (border)", rate: 0.12, hint: "12% extra" },
  tick: { id: "tick", label: "Tick (✔)", rate: 0.12, hint: "12% extra" },
};

export function isMatrimonialAddOnId(value: unknown): value is MatrimonialAddOnId {
  return (
    typeof value === "string" &&
    (MATRIMONIAL_ADDON_IDS as readonly string[]).includes(value)
  );
}

/** Greedy word wrap so long words do not vanish from the line estimate. */
function wrapLine(line: string, max: number): string[] {
  const lines: string[] = [];
  let current = "";

  for (const rawWord of line.split(/\s+/).filter(Boolean)) {
    let word = rawWord;

    // A single token longer than the column is split across lines.
    while (word.length > max) {
      if (current) {
        lines.push(current);
        current = "";
      }
      lines.push(word.slice(0, max));
      word = word.slice(max);
    }

    if (!word) continue;

    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= max) {
      current = `${current} ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

/**
 * Returns the ad matter split into the exact newspaper column lines used for
 * pricing. Paragraph breaks start a new line; blank paragraphs are ignored.
 */
export function wrapMatrimonialLines(
  text: string,
  charsPerLine = MATRIMONIAL_CHARS_PER_LINE,
): string[] {
  const normalised = text.replace(/\r\n?/g, "\n").trim();
  if (!normalised) return [];

  return normalised
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => wrapLine(line, charsPerLine));
}

/**
 * Counts the printed lines in the ad matter. Uses the same wrapping as the
 * preview so the counter and the fixed-width column always agree.
 */
export function countMatrimonialLines(
  text: string,
  charsPerLine = MATRIMONIAL_CHARS_PER_LINE,
): number {
  return wrapMatrimonialLines(text, charsPerLine).length;
}

export type MatrimonialQuote = {
  /** Package rate for up to 5 lines, in rupees. */
  baseRate: number;
  lines: number;
  includedLines: number;
  extraLines: number;
  /** Charge for the extra lines, in rupees. */
  extraLineAmount: number;
  /** Base rate + extra line charge, before add-ons, in rupees. */
  wordingRate: number;
  /** Sum of the selected add-on percentages (0.44 = 44%). */
  addonPercent: number;
  /** Add-on charge, in rupees. */
  addonAmount: number;
  addons: MatrimonialAddOnId[];
  scheme: MatrimonialSchemeId;
  schemeLabel: string;
  /** Ads the customer pays for. */
  paidAds: number;
  /** Ads included free by the scheme. */
  freeAds: number;
  /** Paid + free ads. */
  totalAds: number;
  /** Rate for one insertion (wording + add-ons), in rupees. */
  perAdRate: number;
  /** Final pre-tax rate after the scheme multiplier, in rupees. */
  rate: number;
};

export function calculateMatrimonialRate(
  baseRate: number,
  text: string,
  addons: readonly MatrimonialAddOnId[] = [],
  scheme: MatrimonialSchemeId = "none",
): MatrimonialQuote {
  const safeBase = Math.max(0, Math.round(baseRate));
  const lines = countMatrimonialLines(text);
  const extraLines = Math.max(0, lines - MATRIMONIAL_INCLUDED_LINES);
  const extraLineAmount = Math.round(safeBase * MATRIMONIAL_EXTRA_LINE_RATE * extraLines);
  const wordingRate = safeBase + extraLineAmount;

  const selected = [...new Set(addons)].filter(isMatrimonialAddOnId);
  const addonPercent = selected.reduce((sum, id) => sum + MATRIMONIAL_ADDONS[id].rate, 0);
  const addonAmount = Math.round(wordingRate * addonPercent);

  const selectedScheme = isMatrimonialSchemeId(scheme)
    ? MATRIMONIAL_SCHEMES[scheme]
    : MATRIMONIAL_SCHEMES.none;
  const perAdRate = wordingRate + addonAmount;

  return {
    baseRate: safeBase,
    lines,
    includedLines: MATRIMONIAL_INCLUDED_LINES,
    extraLines,
    extraLineAmount,
    wordingRate,
    addonPercent,
    addonAmount,
    addons: selected,
    scheme: selectedScheme.id,
    schemeLabel: selectedScheme.label,
    paidAds: selectedScheme.paidAds,
    freeAds: selectedScheme.freeAds,
    totalAds: selectedScheme.paidAds + selectedScheme.freeAds,
    perAdRate,
    rate: perAdRate * selectedScheme.paidAds,
  };
}
