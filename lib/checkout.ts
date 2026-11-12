import { getNameChangeSelection } from "@/lib/data";
import { getMatrimonialSelection } from "@/lib/matrimonial";
import { getTenderSelection } from "@/lib/tender";

export type BookingService = "name-change" | "matrimonial" | "tender-notice";

export type CheckoutBooking = {
  service: BookingService;
  city: string;
  paperSlugs: string[];
  label: string;
  unit: string;
  /** Package rate in rupees, as shown on the package picker. */
  rate: number;
};

function parseSlugs(papers: string | string[] | undefined) {
  return (Array.isArray(papers) ? papers : (papers ?? "").split(","))
    .map((slug) => slug.trim())
    .filter(Boolean);
}

/**
 * Rebuilds the selected newspaper package on the server so the payable amount
 * always comes from our own data and never from the client.
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
  };
}

export function resolveMatrimonialBooking(
  packageId: string | undefined,
): CheckoutBooking | null {
  const selection = getMatrimonialSelection(packageId?.trim());
  if (!selection) return null;

  return {
    service: "matrimonial",
    city: selection.cities,
    paperSlugs: selection.papers.map((paper) => paper.slug),
    label: `${selection.name} — ${selection.label}`,
    unit: selection.unit,
    rate: selection.rate,
  };
}

export function resolveTenderBooking(
  city: string | undefined,
  papers: string | string[] | undefined,
): CheckoutBooking | null {
  const cityName = city?.trim();
  if (!cityName) return null;

  const slugs = parseSlugs(papers);
  if (slugs.length === 0) return null;

  const selection = getTenderSelection(slugs, cityName);
  if (!selection) return null;

  return {
    service: "tender-notice",
    city: cityName,
    paperSlugs: selection.papers.map((paper) => paper.slug),
    label: selection.label,
    unit: selection.unit,
    rate: selection.rate,
  };
}

export function resolveBookingForService(
  service: BookingService | undefined,
  city: string | undefined,
  papers: string | string[] | undefined,
  packageId?: string,
): CheckoutBooking | null {
  if (service === "matrimonial") return resolveMatrimonialBooking(packageId);
  if (service === "tender-notice") return resolveTenderBooking(city, papers);
  return resolveCheckoutBooking(city, papers);
}
