import { getNameChangeSelection } from "@/lib/data";
import { NAME_CHANGE_INCLUDED_WORDS } from "@/lib/matrimonial-pricing";

/** Online payment is only offered for the name-change flow. */
export type BookingService = "name-change";

export type CheckoutBooking = {
  service: BookingService;
  city: string;
  paperSlugs: string[];
  label: string;
  unit: string;
  /** Package rate in rupees, as shown on the package picker. */
  rate: number;
  /** Recruitment packages: whether the rate covers lines or words. */
  unitType?: "lines" | "words";
  includedLines?: number;
  includedWords?: number;
};

function parseSlugs(papers: string | string[] | undefined) {
  return (Array.isArray(papers) ? papers : (papers ?? "").split(","))
    .map((slug) => slug.trim())
    .filter(Boolean);
}

/**
 * Rebuilds the selected name-change package on the server so the payable
 * amount always comes from our own data and never from the client.
 */
export function resolveCheckoutBooking(
  city: string | undefined,
  papers: string | string[] | undefined,
): CheckoutBooking | null {
  const cityName = city?.trim();
  if (!cityName) return null;

  const slugs = parseSlugs(papers);
  if (slugs.length === 0) return null;

  const selection = getNameChangeSelection(slugs, cityName);
  if (!selection || !selection.rate || selection.rate <= 0) return null;

  return {
    service: "name-change",
    city: cityName,
    paperSlugs: selection.papers.map((paper) => paper.slug),
    label: selection.label,
    unit: selection.unit,
    rate: selection.rate,
    unitType: "words",
    includedWords: NAME_CHANGE_INCLUDED_WORDS,
  };
}

export function resolveBookingForService(
  service: BookingService | undefined,
  city: string | undefined,
  papers: string | string[] | undefined,
): CheckoutBooking | null {
  // Online payment exists only for name-change; every other category books
  // through the enquiry desk.
  void service;
  return resolveCheckoutBooking(city, papers);
}
