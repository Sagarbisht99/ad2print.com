import { getNameChangeSelection } from "@/lib/data";
import { getLostFoundSelection } from "@/lib/lost-found";
import { getMatrimonialSelection } from "@/lib/matrimonial";
import { getObituarySelection } from "@/lib/obituary";
import { getPropertySelection } from "@/lib/property";
import { getRecruitmentSelection } from "@/lib/recruitment";
import { getTenderSelection } from "@/lib/tender";

export type BookingService = "name-change" | "matrimonial" | "tender-notice" | "recruitment" | "obituary" | "property" | "lost-found";

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

export function resolveRecruitmentBooking(
  packageId: string | undefined,
): CheckoutBooking | null {
  const selection = getRecruitmentSelection(packageId?.trim());
  if (!selection || !selection.rate || selection.rate <= 0) return null;

  return {
    service: "recruitment",
    city: "Delhi",
    paperSlugs: selection.papers.map((paper) => paper.slug),
    label: selection.label,
    unit: selection.unit,
    rate: selection.rate,
    unitType: selection.unitType,
    includedLines: selection.lines,
    includedWords: selection.words,
  };
}

export function resolveObituaryBooking(
  packageId: string | undefined,
): CheckoutBooking | null {
  const selection = getObituarySelection(packageId?.trim());
  if (!selection || !selection.rate || selection.rate <= 0) return null;

  return {
    service: "obituary",
    city: "Delhi",
    paperSlugs: selection.papers.map((paper) => paper.slug),
    label: `${selection.label} · Size ${selection.size} cm`,
    unit: selection.unit,
    rate: selection.rate,
  };
}

export function resolvePropertyBooking(
  packageId: string | undefined,
): CheckoutBooking | null {
  const selection = getPropertySelection(packageId?.trim());
  if (!selection || !selection.rate || selection.rate <= 0) return null;

  return {
    service: "property",
    city: "Delhi",
    paperSlugs: selection.papers.map((paper) => paper.slug),
    label: selection.label,
    unit: selection.unit,
    rate: selection.rate,
    unitType: "lines",
    includedLines: selection.lines,
  };
}

export function resolveLostFoundBooking(
  packageId: string | undefined,
): CheckoutBooking | null {
  const selection = getLostFoundSelection(packageId?.trim());
  if (!selection || !selection.rate || selection.rate <= 0) return null;

  return {
    service: "lost-found",
    city: selection.city,
    paperSlugs: selection.papers.map((paper) => paper.slug),
    label: selection.label,
    unit: selection.unit,
    rate: selection.rate,
    unitType: "lines",
    includedLines: selection.lines,
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
  if (service === "recruitment") return resolveRecruitmentBooking(packageId);
  if (service === "obituary") return resolveObituaryBooking(packageId);
  if (service === "property") return resolvePropertyBooking(packageId);
  if (service === "lost-found") return resolveLostFoundBooking(packageId);
  return resolveCheckoutBooking(city, papers);
}
