/**
 * Name-change wording pricing.
 *
 * A package covers a fixed number of printed lines (baseLines). Every line
 * beyond that adds the package's extraLineRate. Rates are synced from the
 * rate source by `scripts/syncRates.js`; when a package has no explicit
 * extra-line rate yet, the helper falls back to 20% of the package rate so
 * the preview and the server always agree.
 *
 * Kept free of data/JSON imports so the same maths runs on the client preview
 * and on the server that creates the Razorpay order.
 */

import { countTextLines, wrapTextLines } from "@/lib/text-lines";

export const NAME_CHANGE_DEFAULT_BASE_LINES = 5;
export const NAME_CHANGE_DEFAULT_EXTRA_LINE_PERCENT = 0.2;
/** Approximate characters in one classified column line. */
export const NAME_CHANGE_CHARS_PER_LINE = 45;

export type NameChangeLineQuote = {
  /** Package rate for up to `includedLines`, in rupees. */
  baseRate: number;
  /** Printed lines counted from the ad matter. */
  lines: number;
  /** Lines included in the package rate. */
  includedLines: number;
  /** Lines beyond the included amount. */
  extraLines: number;
  /** Charge for one extra line, in rupees. */
  extraLineRate: number;
  /** Total extra-line charge, in rupees. */
  extraLineAmount: number;
  /** Base rate + extra-line charge, in rupees. */
  rate: number;
};

export function countNameChangeLines(
  text: string,
  charsPerLine = NAME_CHANGE_CHARS_PER_LINE,
): number {
  return countTextLines(text, charsPerLine);
}

export function wrapNameChangeLines(
  text: string,
  charsPerLine = NAME_CHANGE_CHARS_PER_LINE,
): string[] {
  return wrapTextLines(text, charsPerLine);
}

export function calculateNameChangeLineQuote(
  baseRate: number,
  text: string,
  options: { baseLines?: number; extraLineRate?: number } = {},
): NameChangeLineQuote {
  const safeBase = Math.max(0, Math.round(baseRate));
  const includedLines = Math.max(
    1,
    Math.round(options.baseLines ?? NAME_CHANGE_DEFAULT_BASE_LINES),
  );
  const extraLineRate =
    options.extraLineRate != null && Number.isFinite(options.extraLineRate)
      ? Math.max(0, Math.round(options.extraLineRate))
      : Math.round(safeBase * NAME_CHANGE_DEFAULT_EXTRA_LINE_PERCENT);

  const lines = countNameChangeLines(text);
  const extraLines = Math.max(0, lines - includedLines);
  const extraLineAmount = extraLines * extraLineRate;

  return {
    baseRate: safeBase,
    lines,
    includedLines,
    extraLines,
    extraLineRate,
    extraLineAmount,
    rate: safeBase + extraLineAmount,
  };
}
